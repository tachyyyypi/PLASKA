import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  initFirebase,
  getUserProfile,
  updateUserProfile,
  getTasks,
  saveTask,
  deleteTask,
  updateSubtaskStatus,
} from './backend/services/firebaseService.js';
import { decomposeTaskWithGemini } from './backend/services/geminiService.js';
import { runLocalDecomposition } from './backend/services/localDecompositionService.js';
import { Task } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Firebase Admin or local fallback
  const firebaseStatus = initFirebase();

  // --- API ROUTES ---

  // Health and config status
  app.get('/api/status', (req, res) => {
    res.json({
      success: true,
      firebase: firebaseStatus,
      geminiKeyPresent: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      time: new Date().toISOString(),
    });
  });

  // User Profile
  app.get('/api/user/profile', async (req, res) => {
    try {
      const profile = await getUserProfile();
      res.json({ success: true, profile });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/user/profile', async (req, res) => {
    try {
      const updated = await updateUserProfile(req.body);
      res.json({ success: true, profile: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Tasks CRUD
  app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await getTasks();
      res.json({ success: true, tasks });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/tasks', async (req, res) => {
    try {
      const task: Task = req.body;
      if (!task.id) {
        task.id = 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      }
      if (!task.created_at) {
        task.created_at = new Date().toISOString();
      }
      task.updated_at = new Date().toISOString();

      const saved = await saveTask(task);
      res.json({ success: true, task: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await deleteTask(id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/tasks/:id/subtask/:subtaskId', async (req, res) => {
    try {
      const { id, subtaskId } = req.params;
      const { isCompleted, actualMinutes } = req.body;
      const updatedTask = await updateSubtaskStatus(id, subtaskId, isCompleted, actualMinutes);
      if (!updatedTask) {
        return res.status(404).json({ success: false, error: 'Task or subtask not found' });
      }
      res.json({ success: true, task: updatedTask });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Gemini AI Decomposition with strict USER-DRIVEN FALLBACK contract
  app.post('/api/decompose', async (req, res) => {
    const { taskName, subject, description, deadline, reference, userRoutines } = req.body;

    if (!taskName || !subject || !deadline) {
      return res.status(400).json({
        success: false,
        error: 'Nama tugas, mata pelajaran, dan deadline wajib diisi.',
      });
    }

    try {
      const result = await decomposeTaskWithGemini(
        taskName,
        subject,
        description || taskName,
        deadline,
        reference,
        userRoutines
      );
      res.json({ success: true, isAi: true, result });
    } catch (err: any) {
      console.error('[Gemini Service Failure]', err.message);
      // SPEC REQUIREMENT: Do NOT automatically switch to local engine!
      // Return clear error with isAiError: true so frontend displays the choice dialog.
      res.status(503).json({
        success: false,
        isAiError: true,
        error: err.message || 'Gagal terhubung ke Gemini AI.',
      });
    }
  });

  // Local Deterministic Decomposition fallback endpoint
  app.post('/api/decompose/local', (req, res) => {
    const { taskName, subject, description, deadline } = req.body;
    try {
      const result = runLocalDecomposition(
        taskName || 'Tugas Baru',
        subject || 'Umum',
        description || '',
        deadline || ''
      );
      res.json({ success: true, isAi: false, result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Explicit API 404 handler so unmatched /api/* requests return JSON instead of HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
  });

  // API Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[API Server Error]', err);
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
    next(err);
  });

  // Vite middleware or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Plaska Task Orchestrator running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
});
