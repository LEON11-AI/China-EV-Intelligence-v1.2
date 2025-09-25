// CMS API for local development - GitHub API Compatible
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, '../content');

// Enhanced request deduplication and caching
const requestCache = new Map();
const activeRequests = new Map();
const CACHE_DURATION = 30000; // 30 seconds
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Ensure content directories exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}
if (!fs.existsSync(path.join(contentDir, 'intelligence'))) {
  fs.mkdirSync(path.join(contentDir, 'intelligence'), { recursive: true });
}
if (!fs.existsSync(path.join(contentDir, 'models'))) {
  fs.mkdirSync(path.join(contentDir, 'models'), { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  // Parse request body for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type']?.includes('application/json')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
        processRequest(req, res);
      } catch (error) {
        console.error('Error parsing JSON body:', error);
        sendErrorResponse(res, 400, 'Invalid JSON body');
      }
    });
  } else {
    processRequest(req, res);
  }
}

function processRequest(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    console.log(`[CMS API] ${req.method} ${pathname}`);
    
    // Check cache for duplicate requests
    const cacheKey = `${req.method}:${pathname}:${JSON.stringify(req.body || {})}`;
    const now = Date.now();
    const cached = requestCache.get(cacheKey);
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`[CMS API] Returning cached response for ${cacheKey}`);
      res.statusCode = cached.statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(cached.response);
      return;
    }
    
    // Route handling
    if (pathname === '/api/cms') {
      handleProxyAPI(req, res, cacheKey);
    } else if (pathname.startsWith('/api/cms/repos/')) {
      handleGitHubAPI(req, res, pathname, cacheKey);
    } else if (pathname === '/api/cms/config') {
      handleConfig(res, cacheKey);
    } else if (pathname.startsWith('/api/cms/media')) {
      handleMedia(req, res);
    } else {
      sendErrorResponse(res, 404, 'Not found');
    }
  } catch (error) {
    console.error('[CMS API] Error:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
}

// Main CMS proxy handler with enhanced error handling
function handleProxyAPI(req, res, cacheKey) {
  const startTime = Date.now();
  
  if (req.method !== 'POST' || !req.body) {
    sendErrorResponse(res, 405, 'Method not allowed');
    return;
  }
  
  const { action, params } = req.body;
  console.log(`[CMS API] Action: ${action}`, params ? JSON.stringify(params) : '');
  
  // Create a promise for this request
  const requestPromise = new Promise(async (resolve, reject) => {
    try {
      let result;
      switch (action) {
        case 'info':
          result = await handleInfo(res, cacheKey);
          break;
        case 'auth':
          result = await handleAuth(res, cacheKey);
          break;
        case 'getMedia':
          result = await handleGetMedia(res, params, cacheKey);
          break;
        case 'entriesByFolder':
          result = await handleEntriesByFolder(res, params, cacheKey);
          break;
        case 'getEntry':
          result = await handleGetEntry(res, params, cacheKey);
          break;
        case 'persistEntry':
          result = await handlePersistEntry(res, params, cacheKey);
          break;
        case 'deleteEntry':
          result = await handleDeleteEntry(res, params, cacheKey);
          break;
        default:
          console.log(`[CMS API] Unknown action: ${action}`);
          const error = { statusCode: 404, message: 'Action not found' };
          reject(error);
          return;
      }
      resolve(result);
    } catch (error) {
      console.error('[CMS API] Error in handleProxyAPI:', error);
      reject({ statusCode: 500, message: 'Internal server error' });
    }
  });
  
  // Store active request
  if (cacheKey) {
    activeRequests.set(cacheKey, requestPromise);
    
    // Clean up after timeout
    setTimeout(() => {
      activeRequests.delete(cacheKey);
    }, REQUEST_TIMEOUT);
  }
  
  // Handle the request
  requestPromise
    .then(result => {
      if (cacheKey) {
        activeRequests.delete(cacheKey);
      }
      console.log(`[CMS API] Request completed in ${Date.now() - startTime}ms`);
    })
    .catch(error => {
      if (cacheKey) {
        activeRequests.delete(cacheKey);
      }
      sendErrorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    });
}

function handleGitHubAPI(req, res, pathname, cacheKey) {
  // Handle GitHub API compatible endpoints
  const pathParts = pathname.split('/');
  // /api/cms/repos/{owner}/{repo}/contents/{path}
  
  if (pathParts.length >= 7 && pathParts[5] === 'contents') {
    const contentPath = pathParts.slice(6).join('/');
    
    if (req.method === 'GET') {
      handleGitHubContents(res, contentPath, cacheKey);
    } else {
      sendErrorResponse(res, 405, 'Method not allowed');
    }
  } else {
    sendErrorResponse(res, 404, 'Not found');
  }
}

async function handleInfo(res, cacheKey) {
  const info = {
    version: '1.0.0',
    git_version: '2.0.0',
    features: {
      users: false,
      collections: true,
      editor: true,
      media: true,
      branches: false
    },
    backend: 'github'
  };
  
  return sendSuccessResponse(res, info, cacheKey);
}

async function handleAuth(res, cacheKey) {
  const authData = {
    token: 'mock-token-' + Date.now(),
    user: {
      login: 'local-user',
      name: 'Local User',
      email: 'user@local.dev',
      avatar_url: '',
      id: 1,
      type: 'User'
    },
    scope: 'repo'
  };
  
  return sendSuccessResponse(res, authData, cacheKey);
}

async function handleUser(req, res) {
  const userData = {
    login: 'local-user',
    id: 1,
    name: 'Local User',
    email: 'user@local.dev',
    avatar_url: '',
    type: 'User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return sendSuccessResponse(res, userData);
}

async function handleGetMedia(res, params, cacheKey) {
  try {
    const mediaDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }
    
    const files = fs.readdirSync(mediaDir)
      .filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file))
      .map(file => {
        const filePath = path.join(mediaDir, file);
        const stats = fs.statSync(filePath);
        const sha = generateSHA(file + stats.mtime.getTime());
        
        return {
          name: file,
          path: `uploads/${file}`,
          sha: sha,
          size: stats.size,
          url: `/api/cms/repos/local/repo/contents/uploads/${file}`,
          html_url: `/uploads/${file}`,
          git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
          download_url: `/uploads/${file}`,
          type: 'file',
          _links: {
            self: `/api/cms/repos/local/repo/contents/uploads/${file}`,
            git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
            html: `/uploads/${file}`
          },
          // CMS specific fields
          id: file,
          displayURL: `/uploads/${file}`,
          isViewableImage: true
        };
      });
    
    console.log(`[CMS API] Found ${files.length} media files`);
    return sendSuccessResponse(res, files, cacheKey);
  } catch (error) {
    console.error('[CMS API] Error in handleGetMedia:', error);
    throw { statusCode: 500, message: 'Failed to get media files' };
  }
}

async function handleEntriesByFolder(res, params, cacheKey) {
  try {
    const { folder, extension, depth } = params || {};
    
    console.log('[CMS API] entriesByFolder params:', JSON.stringify(params));
    
    if (!folder) {
      console.log('[CMS API] No folder specified');
      return sendSuccessResponse(res, [], cacheKey);
    }
    
    let collection = folder;
    if (folder.startsWith('content/')) {
      collection = folder.replace('content/', '');
    }
    
    console.log(`[CMS API] Getting entries for collection: ${collection}`);
    
    const collectionPath = path.join(contentDir, collection);
    
    if (!fs.existsSync(collectionPath)) {
      console.log(`[CMS API] Collection path does not exist: ${collectionPath}`);
      return sendSuccessResponse(res, [], cacheKey);
    }
    
    const files = fs.readdirSync(collectionPath)
      .filter(file => {
        if (extension) {
          return file.endsWith(extension);
        }
        return file.endsWith('.md') || file.endsWith('.markdown');
      })
      .map(file => {
        const filePath = path.join(collectionPath, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = parseMarkdownFile(content);
        const sha = generateSHA(content + stats.mtime.getTime());
        const relativePath = `content/${collection}/${file}`;
        
        return {
          // GitHub API format
          name: file,
          path: relativePath,
          sha: sha,
          size: stats.size,
          url: `/api/cms/repos/local/repo/contents/${relativePath}`,
          html_url: `/api/cms/repos/local/repo/contents/${relativePath}`,
          git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
          download_url: `/api/cms/repos/local/repo/contents/${relativePath}`,
          type: 'file',
          content: Buffer.from(content).toString('base64'),
          encoding: 'base64',
          _links: {
            self: `/api/cms/repos/local/repo/contents/${relativePath}`,
            git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
            html: `/api/cms/repos/local/repo/contents/${relativePath}`
          },
          // CMS specific fields
          slug: path.basename(file, path.extname(file)),
          raw: content,
          data: parsed.data,
          isModification: false,
          newPath: relativePath,
          meta: {
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
            created: stats.birthtime.toISOString()
          }
        };
      });
    
    console.log(`[CMS API] Found ${files.length} entries for collection ${collection}`);
    return sendSuccessResponse(res, files, cacheKey);
  } catch (error) {
    console.error('[CMS API] Error in entriesByFolder:', error);
    if (error.statusCode) {
      throw error;
    }
    throw { statusCode: 500, message: 'Error reading folder entries' };
  }
}

async function handleGetEntry(res, params, cacheKey) {
  try {
    const { path: entryPath } = params;
    
    if (!entryPath) {
      throw { statusCode: 400, message: 'Missing path parameter' };
    }
    
    const fullPath = path.join(contentDir, entryPath);
    
    if (!fs.existsSync(fullPath)) {
      throw { statusCode: 404, message: 'Entry not found' };
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const parsed = parseMarkdownFile(content);
    const stats = fs.statSync(fullPath);
    const sha = generateSHA(content + stats.mtime.getTime());
    
    const entry = {
      // GitHub API format
      name: path.basename(entryPath),
      path: entryPath,
      sha: sha,
      size: stats.size,
      url: `/api/cms/repos/local/repo/contents/${entryPath}`,
      html_url: `/api/cms/repos/local/repo/contents/${entryPath}`,
      git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
      download_url: `/api/cms/repos/local/repo/contents/${entryPath}`,
      type: 'file',
      content: Buffer.from(content).toString('base64'),
      encoding: 'base64',
      _links: {
        self: `/api/cms/repos/local/repo/contents/${entryPath}`,
        git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
        html: `/api/cms/repos/local/repo/contents/${entryPath}`
      },
      // CMS specific fields
      slug: path.basename(entryPath, path.extname(entryPath)),
      raw: content,
      data: parsed.data,
      isModification: false,
      newPath: entryPath,
      meta: {
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        created: stats.birthtime.toISOString()
      }
    };
    
    return sendSuccessResponse(res, entry, cacheKey);
  } catch (error) {
    console.error('[CMS API] Error in handleGetEntry:', error);
    if (error.statusCode) {
      throw error;
    }
    throw { statusCode: 500, message: 'Error reading entry' };
  }
}

async function handlePersistEntry(res, params, cacheKey) {
  try {
    const { path: entryPath, raw, slug, sha: oldSha } = params || {};
    
    if (!entryPath || !raw) {
      throw { statusCode: 400, message: 'Missing required parameters' };
    }
    
    const fullPath = path.join(contentDir, entryPath.replace('content/', ''));
    const dir = path.dirname(fullPath);
    const isUpdate = fs.existsSync(fullPath);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(fullPath, raw, 'utf8');
    
    const stats = fs.statSync(fullPath);
    const sha = generateSHA(raw + stats.mtime.getTime());
    
    const response = {
      // GitHub API format
      content: {
        name: path.basename(entryPath),
        path: entryPath,
        sha: sha,
        size: stats.size,
        url: `/api/cms/repos/local/repo/contents/${entryPath}`,
        html_url: `/api/cms/repos/local/repo/contents/${entryPath}`,
        git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
        download_url: `/api/cms/repos/local/repo/contents/${entryPath}`,
        type: 'file',
        _links: {
          self: `/api/cms/repos/local/repo/contents/${entryPath}`,
          git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
          html: `/api/cms/repos/local/repo/contents/${entryPath}`
        }
      },
      commit: {
        sha: sha,
        message: isUpdate ? `Update ${entryPath}` : `Create ${entryPath}`,
        author: {
          name: 'Local User',
          email: 'user@local.dev',
          date: new Date().toISOString()
        },
        committer: {
          name: 'Local User',
          email: 'user@local.dev',
          date: new Date().toISOString()
        }
      },
      // CMS specific fields
      slug: slug || path.basename(entryPath, path.extname(entryPath)),
      raw: raw,
      isModification: isUpdate,
      newPath: entryPath
    };
    
    console.log(`[CMS API] ${isUpdate ? 'Updated' : 'Created'} entry: ${entryPath}`);
    return sendSuccessResponse(res, response, cacheKey);
  } catch (error) {
    console.error('[CMS API] Error in handlePersistEntry:', error);
    if (error.statusCode) {
      throw error;
    }
    throw { statusCode: 500, message: 'Error persisting entry' };
  }
}

async function handleDeleteEntry(res, params, cacheKey) {
  try {
    const { path: entryPath, sha } = params;
    
    if (!entryPath) {
      throw { statusCode: 400, message: 'Missing path parameter' };
    }
    
    const fullPath = path.join(contentDir, entryPath);
    
    if (!fs.existsSync(fullPath)) {
      throw { statusCode: 404, message: 'Entry not found' };
    }
    
    // Read file before deletion for response
    const content = fs.readFileSync(fullPath, 'utf8');
    const stats = fs.statSync(fullPath);
    const fileSha = generateSHA(content + stats.mtime.getTime());
    
    // Delete the file
    fs.unlinkSync(fullPath);
    
    const response = {
      // GitHub API format
      content: null,
      commit: {
        sha: fileSha,
        message: `Delete ${entryPath}`,
        author: {
          name: 'Local User',
          email: 'user@local.dev',
          date: new Date().toISOString()
        },
        committer: {
          name: 'Local User',
          email: 'user@local.dev',
          date: new Date().toISOString()
        }
      },
      // CMS specific fields
      message: 'Entry deleted successfully',
      path: entryPath
    };
    
    console.log(`[CMS API] Deleted entry: ${entryPath}`);
    return sendSuccessResponse(res, response, cacheKey);
  } catch (error) {
    console.error('[CMS API] Error in handleDeleteEntry:', error);
    if (error.statusCode) {
      throw error;
    }
    throw { statusCode: 500, message: 'Error deleting entry' };
  }
}

async function handleGitHubContents(res, contentPath, cacheKey) {
  try {
    const fullPath = path.join(process.cwd(), contentPath);
    
    if (!fs.existsSync(fullPath)) {
      sendErrorResponse(res, 404, 'File not found');
      return;
    }
    
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Return directory contents
      const files = fs.readdirSync(fullPath)
        .filter(file => !file.startsWith('.')) // Filter hidden files
        .map(file => {
          const filePath = path.join(fullPath, file);
          const fileStats = fs.statSync(filePath);
          const relativePath = `${contentPath}/${file}`.replace(/\/\//g, '/');
          const sha = generateSHA(file + fileStats.mtime.getTime());
          
          return {
            name: file,
            path: relativePath,
            sha: sha,
            size: fileStats.size,
            url: `/api/cms/repos/local/repo/contents/${relativePath}`,
            html_url: `/api/cms/repos/local/repo/contents/${relativePath}`,
            git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
            download_url: fileStats.isDirectory() ? null : `/api/cms/repos/local/repo/contents/${relativePath}`,
            type: fileStats.isDirectory() ? 'dir' : 'file',
            _links: {
              self: `/api/cms/repos/local/repo/contents/${relativePath}`,
              git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
              html: `/api/cms/repos/local/repo/contents/${relativePath}`
            }
          };
        });
      
      sendSuccessResponse(res, files, cacheKey);
    } else {
      // Return file content
      const content = fs.readFileSync(fullPath, 'utf8');
      const sha = generateSHA(content + stats.mtime.getTime());
      const normalizedPath = contentPath.replace(/\/\//g, '/');
      
      const response = {
        name: path.basename(contentPath),
        path: normalizedPath,
        sha: sha,
        size: stats.size,
        url: `/api/cms/repos/local/repo/contents/${normalizedPath}`,
        html_url: `/api/cms/repos/local/repo/contents/${normalizedPath}`,
        git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
        download_url: `/api/cms/repos/local/repo/contents/${normalizedPath}`,
        type: 'file',
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64',
        _links: {
          self: `/api/cms/repos/local/repo/contents/${normalizedPath}`,
          git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
          html: `/api/cms/repos/local/repo/contents/${normalizedPath}`
        }
      };
      
      sendSuccessResponse(res, response, cacheKey);
    }
  } catch (error) {
    console.error('[CMS API] Error in handleGitHubContents:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
}

async function handleConfig(res, cacheKey) {
  try {
    const config = {
      backend: {
        name: 'github',
        repo: 'local/repo',
        branch: 'main',
        api_root: '/api/cms',
        base_url: '/api/cms',
        auth_url: '/api/cms/auth',
        cms_label_prefix: 'cms/',
        squash_merges: true
      },
      media_folder: 'public/images',
      public_folder: '/images',
      site_url: 'http://localhost:5173',
      display_url: 'http://localhost:5173',
      logo_url: '/images/logo.png',
      collections: [
        {
          name: 'intelligence',
          label: 'Intelligence Reports',
          folder: 'content/intelligence',
          create: true,
          slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
          fields: [
            { label: 'Title', name: 'title', widget: 'string' },
            { label: 'Date', name: 'date', widget: 'datetime' },
            { label: 'Category', name: 'category', widget: 'select', options: ['Market Analysis', 'Technology', 'Policy', 'Industry News'] },
            { label: 'Tags', name: 'tags', widget: 'list', default: [] },
            { label: 'Summary', name: 'summary', widget: 'text' },
            { label: 'Content', name: 'body', widget: 'markdown' },
            { label: 'Featured Image', name: 'featured_image', widget: 'image', required: false },
            { label: 'Author', name: 'author', widget: 'string', default: 'China EV Intelligence' },
            { label: 'Source', name: 'source', widget: 'string', required: false },
            { label: 'Source URL', name: 'source_url', widget: 'string', required: false }
          ]
        },
        {
          name: 'models',
          label: 'EV Models',
          folder: 'content/models',
          create: true,
          slug: '{{slug}}',
          fields: [
            { label: 'Model Name', name: 'title', widget: 'string' },
            { label: 'Brand', name: 'brand', widget: 'string' },
            { label: 'Model Year', name: 'year', widget: 'number' },
            { label: 'Price Range', name: 'price_range', widget: 'string' },
            { label: 'Range (km)', name: 'range', widget: 'number' },
            { label: 'Battery Capacity (kWh)', name: 'battery_capacity', widget: 'number' },
            { label: 'Motor Power (kW)', name: 'motor_power', widget: 'number' },
            { label: 'Body Type', name: 'body_type', widget: 'select', options: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van'] },
            { label: 'Drive Type', name: 'drive_type', widget: 'select', options: ['FWD', 'RWD', 'AWD'] },
            { label: 'Charging Speed (kW)', name: 'charging_speed', widget: 'number' },
            { label: 'Description', name: 'body', widget: 'markdown' },
            { label: 'Images', name: 'images', widget: 'list', field: { label: 'Image', name: 'image', widget: 'image' } },
            { label: 'Specifications', name: 'specifications', widget: 'object', fields: [
              { label: 'Length (mm)', name: 'length', widget: 'number' },
              { label: 'Width (mm)', name: 'width', widget: 'number' },
              { label: 'Height (mm)', name: 'height', widget: 'number' },
              { label: 'Wheelbase (mm)', name: 'wheelbase', widget: 'number' },
              { label: 'Curb Weight (kg)', name: 'curb_weight', widget: 'number' }
            ]}
          ]
        }
      ]
    };
    
    console.log('[CMS API] Config requested');
    return sendSuccessResponse(res, config, cacheKey);
  } catch (error) {
    console.error('[CMS API] Error in handleConfig:', error);
    throw { statusCode: 500, message: 'Error loading configuration' };
  }
}

async function handleMedia(req, res) {
  try {
    if (req.method === 'GET') {
      // List media files
      const mediaDir = path.join(process.cwd(), 'public', 'images');
      
      if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
      }
      
      const files = fs.readdirSync(mediaDir)
        .filter(file => /\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff)$/i.test(file))
        .map(file => {
          const filePath = path.join(mediaDir, file);
          const stats = fs.statSync(filePath);
          const sha = generateSHA(file + stats.mtime.getTime());
          
          return {
            // GitHub API format
            name: file,
            path: `public/images/${file}`,
            sha: sha,
            size: stats.size,
            url: `/api/cms/repos/local/repo/contents/public/images/${file}`,
            html_url: `/images/${file}`,
            git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
            download_url: `/images/${file}`,
            type: 'file',
            _links: {
              self: `/api/cms/repos/local/repo/contents/public/images/${file}`,
              git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
              html: `/images/${file}`
            },
            // CMS specific fields
            id: sha,
            displayURL: `/images/${file}`,
            lastModified: stats.mtime.toISOString()
          };
        });
      
      console.log(`[CMS API] Listed ${files.length} media files`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(files));
    } else if (req.method === 'POST') {
      // Upload media file
      upload.single('file')(req, res, async (err) => {
        if (err) {
          console.error('[CMS API] Upload error:', err);
          return sendErrorResponse(res, 400, err.message);
        }
        
        if (!req.file) {
          return sendErrorResponse(res, 400, 'No file uploaded');
        }
        
        try {
          const mediaDir = path.join(process.cwd(), 'public', 'images');
          if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir, { recursive: true });
          }
          
          const fileName = req.file.originalname;
          const filePath = path.join(mediaDir, fileName);
          
          fs.writeFileSync(filePath, req.file.buffer);
          
          const stats = fs.statSync(filePath);
          const sha = generateSHA(fileName + stats.mtime.getTime());
          
          const response = {
            // GitHub API format
            content: {
              name: fileName,
              path: `public/images/${fileName}`,
              sha: sha,
              size: stats.size,
              url: `/api/cms/repos/local/repo/contents/public/images/${fileName}`,
              html_url: `/images/${fileName}`,
              git_url: `/api/cms/repos/local/repo/git/blobs/${sha}`,
              download_url: `/images/${fileName}`,
              type: 'file',
              _links: {
                self: `/api/cms/repos/local/repo/contents/public/images/${fileName}`,
                git: `/api/cms/repos/local/repo/git/blobs/${sha}`,
                html: `/images/${fileName}`
              }
            },
            commit: {
              sha: sha,
              message: `Upload ${fileName}`,
              author: {
                name: 'Local User',
                email: 'user@local.dev',
                date: new Date().toISOString()
              },
              committer: {
                name: 'Local User',
                email: 'user@local.dev',
                date: new Date().toISOString()
              }
            },
            // CMS specific fields
            id: sha,
            displayURL: `/images/${fileName}`,
            lastModified: stats.mtime.toISOString()
          };
          
          console.log(`[CMS API] Uploaded file: ${fileName}`);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify(response));
        } catch (error) {
          console.error('[CMS API] Error saving file:', error);
          sendErrorResponse(res, 500, 'Error saving file');
        }
      });
    } else {
      sendErrorResponse(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('[CMS API] Error in handleMedia:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
}

// Utility functions
function sendSuccessResponse(res, data, cacheKey) {
  const response = JSON.stringify(data);
  
  // Cache the response
  if (cacheKey) {
    requestCache.set(cacheKey, {
      statusCode: 200,
      response: response,
      timestamp: Date.now()
    });
  }
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.end(response);
}

function sendErrorResponse(res, statusCode, message) {
  const errorResponse = {
    message: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    documentation_url: 'https://docs.github.com/rest'
  };
  
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.end(JSON.stringify(errorResponse));
}

function generateSHA(input) {
  return Buffer.from(input).toString('hex').substring(0, 40);
}

function parseMarkdownFile(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  let data = {};
  let body = content;
  
  if (frontmatterMatch) {
    try {
      const frontmatter = frontmatterMatch[1];
      body = frontmatterMatch[2] || '';
      
      // Simple YAML parsing for basic fields
      const lines = frontmatter.split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
          let value = match[2].trim();
          // Remove quotes
          value = value.replace(/^["']|["']$/g, '');
          // Handle arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              value = JSON.parse(value);
            } catch (e) {
              // Keep as string if JSON parsing fails
            }
          }
          data[match[1].trim()] = value;
        }
      });
    } catch (e) {
      console.error('[CMS API] Error parsing frontmatter:', e);
    }
  }
  
  return { data, content: body };
}

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION * 10) {
      requestCache.delete(key);
    }
  }
}, CACHE_DURATION * 5);