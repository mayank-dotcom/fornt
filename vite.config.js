import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Root directory of the project
  publicDir: 'public', // Points to the public folder for static assets
  build: {
    outDir: 'dist', // Directory for build output
    rollupOptions: {
      input: './index.html', // Ensure the correct entry file
    },
  },
});
