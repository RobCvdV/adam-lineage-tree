import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/adam-lineage-tree/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    open: true,
    allowedHosts: ['localhost', 'mbmx.akiar.nl']
  },
});
