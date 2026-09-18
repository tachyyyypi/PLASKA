// force re-deploy after repo rename
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Determine base URL dynamically based on GitHub Actions environment or repo name fallback
  const repoName = process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/PLASKA-Smart-Task-Study-Orchestrator/';

  return {
    base: process.env.VITE_BASE_PATH || repoName || '/PLASKA-Smart-Task-Study-Orchestrator/',
    plugins: [react(), tailwindcss()],
    build: {
      target: 'esnext',
      outDir: 'dist',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: {
        overlay: false,
      },
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
