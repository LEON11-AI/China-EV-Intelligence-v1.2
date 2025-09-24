import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        watch: {
          // Ignore admin directory file changes to prevent frequent reloads
          ignored: ['**/public/admin/**']
        }
      },
      plugins: [
        react(),
        viteImagemin({
          gifsicle: {
            optimizationLevel: 7,
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 7,
          },
          mozjpeg: {
            quality: 80,
          },
          pngquant: {
            quality: [0.8, 0.9],
            speed: 4,
          },
          svgo: {
            plugins: [
              {
                name: 'removeViewBox',
              },
              {
                name: 'removeEmptyAttrs',
                active: false,
              },
            ],
          },
        }),
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
        },
         {
           name: 'api-middleware',
           configureServer(server) {
             // Handle CMS API requests
             server.middlewares.use((req, res, next) => {
               if (req.url?.startsWith('/api/')) {
                 import('./api/cms.js').then(({ default: handler }) => {
                   handler(req, res);
                 }).catch(error => {
                   console.error('API Error:', error);
                   res.statusCode = 500;
                   res.end('Internal Server Error');
                 });
                 return;
               }
               
               next();
             });
           }
         }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
