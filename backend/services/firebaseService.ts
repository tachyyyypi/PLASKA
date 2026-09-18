import { Task, UserProfile } from '../../src/types.js';

// Initial default user profile with Siswa Plaska default
const defaultUserProfile: UserProfile = {
  id: 'user_plaska_1',
  name: 'Siswa Plaska',
  email: 'siswa@plaska.sch.id',
  school_name: 'SMAN 1 Plaska',
  sleep_schedule: {
    sleep_start: '22:00',
    sleep_end: '05:30',
  },
  school_schedule: {
    school_start: '07:00',
    school_end: '15:00',
    active_days: [1, 2, 3, 4, 5],
  },
  routine_activities: [
    { id: 'r1', name: 'Ibadah / Sholat', start_time: '05:30', end_time: '06:00', days: [1, 2, 3, 4, 5, 6, 0], constraint_type: 'HARD' },
    { id: 'r2', name: 'Istirahat Siang', start_time: '15:00', end_time: '16:00', days: [1, 2, 3, 4, 5], constraint_type: 'FLEXIBLE' },
  ],
  one_time_events: [],
  preferences: {
    max_session_min: 90,
    break_min: 15,
  },
  personal_factor: 1.0,
  total_ai_estimated_minutes: 0,
  total_actual_minutes: 0,
};

// Initial seeded sample tasks (Empty fresh state as requested)
const defaultTasks: Task[] = [];

let localUserProfile: UserProfile = { ...defaultUserProfile };
let localTasks: Task[] = [...defaultTasks];

export function initFirebase(): { connected: boolean; mode: 'firebase' | 'local'; message: string } {
  return {
    connected: false,
    mode: 'local',
    message: 'Running in Local Storage & Memory Orchestrator (Firebase Auth removed)',
  };
}

export async function getUserProfile(userId = 'user_plaska_1'): Promise<UserProfile> {
  return localUserProfile;
}

export async function updateUserProfile(profile: Partial<UserProfile>, userId = 'user_plaska_1'): Promise<UserProfile> {
  localUserProfile = { ...localUserProfile, ...profile };
  return localUserProfile;
}

export async function getTasks(userId = 'user_plaska_1'): Promise<Task[]> {
  return localTasks;
}

export async function saveTask(task: Task): Promise<Task> {
  const existingIdx = localTasks.findIndex((t) => t.id === task.id);
  if (existingIdx >= 0) {
    localTasks[existingIdx] = task;
  } else {
    localTasks.unshift(task);
  }
  return task;
}

export async function deleteTask(taskId: string): Promise<boolean> {
  localTasks = localTasks.filter((t) => t.id !== taskId);
  return true;
}

export async function updateSubtaskStatus(
  taskId: string,
  subtaskId: string,
  isCompleted: boolean,
  actualMinutes?: number
): Promise<Task | null> {
  const task = localTasks.find((t) => t.id === taskId);
  if (!task) return null;

  const subtask = task.subtasks.find((s) => s.id === subtaskId);
  if (!subtask) return null;

  subtask.is_completed = isCompleted;
  if (actualMinutes !== undefined) {
    subtask.actual_minutes_logged = actualMinutes;
  }

  const allCompleted = task.subtasks.every((s) => s.is_completed);
  const anyCompleted = task.subtasks.some((s) => s.is_completed);
  task.status = allCompleted ? 'COMPLETED' : anyCompleted ? 'IN_PROGRESS' : 'PENDING';
  task.updated_at = new Date().toISOString();

  if (actualMinutes !== undefined && actualMinutes > 0) {
    const aiEst = subtask.estimated_minutes || 30;
    localUserProfile.total_ai_estimated_minutes += aiEst;
    localUserProfile.total_actual_minutes += actualMinutes;
    localUserProfile.personal_factor = parseFloat(
      (localUserProfile.total_actual_minutes / localUserProfile.total_ai_estimated_minutes).toFixed(2)
    );
  }

  return task;
}

