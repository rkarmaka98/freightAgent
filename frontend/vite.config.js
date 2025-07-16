import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// basic Vite config with React plugin
export default defineConfig({
  plugins: [react()],
});
