import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    target: 'es2018',
    // Optimize chunk strategy
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom'
          ],
          'firebase-core': [
            'firebase/app',
            'firebase/auth'
          ],
          'firebase-services': [
            'firebase/firestore',
            'firebase/storage'
          ],
          'ui': [
            'lucide-react'
          ]
        }
      }
    },
    // Enable chunk size reporting
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  // Optimize asset handling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'lucide-react']
  }
});