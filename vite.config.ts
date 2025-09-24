import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        watch: {
          // 忽略admin目录的文件变化，防止频繁重新加载
          ignored: ['**/public/admin/**']
        }
      },
      plugins: [
        react(),
        {
          name: 'admin-redirect-middleware',
          configureServer(server) {
            // 简单的admin路径重定向处理
            server.middlewares.use((req, res, next) => {
              // 如果访问/admin或/admin/，重定向到/admin/index.html
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
             // 处理CMS API请求
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
