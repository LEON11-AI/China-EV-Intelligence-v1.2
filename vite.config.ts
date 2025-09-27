import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      build: {
        rollupOptions: {
          external: [],
          output: {
            manualChunks: undefined,
          },
        },
        target: 'esnext',
        minify: 'esbuild',
      },
      server: {
        watch: {
          // Ignore admin directory file changes to prevent frequent reloads
          ignored: ['**/public/admin/**']
        },
        proxy: {
          '/backend-api/cms': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/backend-api\/cms/, '/api/cms')
          }
        }
      },
      plugins: [
        react(),
        // Conditionally enable imagemin only in production and not in CI
        ...(mode === 'production' && !process.env.CI ? [viteImagemin({
          gifsicle: {
            optimizationLevel: 3, // Reduced from 7 to 3 for faster builds
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 3, // Reduced from 7 to 3
          },
          mozjpeg: {
            quality: 85, // Increased from 80 to reduce compression time
          },
          pngquant: {
            quality: [0.85, 0.95], // Relaxed quality range
            speed: 1, // Fastest speed setting
          },
          svgo: {
            plugins: [
              {
                name: 'removeViewBox',
              },
            ],
          },
        })] : []),
        {
          name: 'admin-redirect-middleware',
          configureServer(server) {
            // Simple admin path redirect handling
            server.middlewares.use((req, res, next) => {
              // If accessing /admin or /admin/, redirect to /admin/index.html
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
