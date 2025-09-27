#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'intelligence');
const DATA_FILE = path.join(__dirname, '..', 'public', 'data', 'intelligence.json');
const REPORTS_DIR = path.join(__dirname, '..', 'public', 'reports');

// Function to read markdown files and convert to JSON
function syncIntelligenceContent() {
  console.log('Syncing intelligence content...');
  
  const intelligenceData = [];
  
  // Read markdown files from content/intelligence
  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(CONTENT_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // Convert to intelligence item format
      const item = {
        id: data.id || file.replace('.md', ''),
        title: data.title || '',
        date: data.date || new Date().toISOString().split('T')[0],
        brand: data.brand || 'Industry',
        model: data.model || '',
        category: data.category || 'general',
        tags: data.tags || [],
        summary: data.summary || '',
        content: content,
        author: data.author || 'China EV Intelligence Team',
        read_time: data.reading_time || data.read_time || 5,
        importance: data.importance || 'medium',
        is_pro: data.is_pro || false,
        confidence: data.confidence || 'medium',
        source: data.source || 'Internal Analysis',
        status: data.status || 'verified',
        featured: data.featured || false
      };
      
      // Only include published content
      if (data.published !== false) {
        intelligenceData.push(item);
      }
    });
  }
  
  // Read HTML reports
  if (fs.existsSync(REPORTS_DIR)) {
    const htmlFiles = fs.readdirSync(REPORTS_DIR).filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
      const htmlPath = path.join(REPORTS_DIR, file);
      const metadataPath = path.join(REPORTS_DIR, file.replace('.html', '.json'));
      
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        const item = {
          id: metadata.id || file.replace('.html', ''),
          title: metadata.title || '',
          date: metadata.date || new Date().toISOString().split('T')[0],
          brand: metadata.brand || 'Industry',
          model: metadata.model || '',
          category: metadata.category || 'Market Analysis',
          tags: metadata.tags || [],
          summary: metadata.summary || '',
          content: `html:/${file}`,
          author: metadata.author || 'China EV Intelligence Team',
          read_time: metadata.reading_time || metadata.read_time || 10,
          importance: metadata.importance || 'high',
          is_pro: metadata.is_pro !== false,
          confidence: metadata.confidence || 'high',
          source: metadata.source || 'Market Research',
          status: metadata.status || 'verified',
          featured: metadata.featured || false,
          content_type: 'html'
        };
        
        // Only include published content
        if (metadata.published !== false) {
          intelligenceData.push(item);
        }
      }
    });
  }
  
  // Sort by date (newest first)
  intelligenceData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Write to data file
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(intelligenceData, null, 2));
  console.log(`Synced ${intelligenceData.length} intelligence articles to ${DATA_FILE}`);
}

// Function to watch for changes
function watchContent() {
  console.log('Watching for content changes...');
  
  if (fs.existsSync(CONTENT_DIR)) {
    fs.watch(CONTENT_DIR, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.md')) {
        console.log(`Content changed: ${filename}`);
        setTimeout(syncIntelligenceContent, 1000); // Debounce
      }
    });
  }
  
  if (fs.existsSync(REPORTS_DIR)) {
    fs.watch(REPORTS_DIR, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.html') || filename.endsWith('.json'))) {
        console.log(`Report changed: ${filename}`);
        setTimeout(syncIntelligenceContent, 1000); // Debounce
      }
    });
  }
}

// Main execution
if (import.meta.url === `file://${__filename}`) {
  const command = process.argv[2];
  
  if (command === 'watch') {
    syncIntelligenceContent();
    watchContent();
  } else {
    syncIntelligenceContent();
  }
}

export { syncIntelligenceContent };