import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Third-party code changes less often than app code; separate chunks keep it cached across deploys.
const vendorChunks: Record<string, string[]> = {
  react: ['react', 'react-dom', 'react-router', 'scheduler'],
  chakra: ['@chakra-ui', '@emotion', '@ark-ui', '@zag-js', '@pandacss'],
  query: ['@tanstack'],
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          for (const [chunk, packages] of Object.entries(vendorChunks)) {
            if (packages.some((p) => id.includes(`/node_modules/${p}/`))) return chunk;
          }
        },
      },
    },
  },
});
