import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Optimized Vite config for Vercel deployment - faster builds
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      build: {
        // Optimize build performance
        target: 'es2020',
        minify: 'esbuild', // Faster than terser
        sourcemap: false, // Disable sourcemaps for faster builds
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['react-router-dom'],
              ui: ['lucide-react']
            }
          }
        }
      },
      server: {
        watch: {
          ignored: ['**/public/admin/**']
        }
      },
      plugins: [
        react(),
        {
          name: 'admin-redirect-middleware',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              if (req.url === '/admin' || req.url === '/admin/') {
                res.writeHead(302, { 'Location': '/admin/index.html' });
                res.end();
                return;
              }
              next();
            });
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});