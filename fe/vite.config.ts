import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Enable Emotion support
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    // Ensure Vite resolves Emotion and MUI correctly
    dedupe: ['@emotion/react', '@emotion/styled', '@mui/material'],
  },
  optimizeDeps: {
    // Explicitly include Emotion and MUI in the dependency optimization
    include: ['@emotion/react', '@emotion/styled', '@mui/material'],
  },
});