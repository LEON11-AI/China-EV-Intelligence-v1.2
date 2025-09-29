#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { syncIntelligenceContent } from './sync-cms-content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to watch
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const REPORTS_DIR = path.join(__dirname, '..', 'public', 'reports');

class ContentWatcher {
  constructor() {
    this.debounceTimeout = null;
    this.isWatching = false;
    this.watchers = [];
  }

  // Debounced sync function to avoid multiple rapid syncs
  debouncedSync() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    
    this.debounceTimeout = setTimeout(() => {
      console.log('🔄 Content changed, syncing...');
      try {
        syncIntelligenceContent();
        console.log('✅ Content sync completed successfully');
      } catch (error) {
        console.error('❌ Content sync failed:', error.message);
      }
    }, 1000); // Wait 1 second after last change
  }

  // Watch content directory
  watchContent() {
    if (!fs.existsSync(CONTENT_DIR)) {
      console.warn(`⚠️  Content directory not found: ${CONTENT_DIR}`);
      return;
    }

    console.log(`👀 Watching content directory: ${CONTENT_DIR}`);
    
    const watcher = fs.watch(CONTENT_DIR, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.md') || filename.endsWith('.json'))) {
        console.log(`📝 Content file changed: ${filename} (${eventType})`);
        this.debouncedSync();
      }
    });
    
    this.watchers.push(watcher);
  }

  // Watch reports directory
  watchReports() {
    if (!fs.existsSync(REPORTS_DIR)) {
      console.warn(`⚠️  Reports directory not found: ${REPORTS_DIR}`);
      return;
    }

    console.log(`👀 Watching reports directory: ${REPORTS_DIR}`);
    
    const watcher = fs.watch(REPORTS_DIR, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.md') || filename.endsWith('.html') || filename.endsWith('.json'))) {
        console.log(`📊 Report file changed: ${filename} (${eventType})`);
        this.debouncedSync();
      }
    });
    
    this.watchers.push(watcher);
  }

  // Start watching all directories
  start() {
    if (this.isWatching) {
      console.log('⚠️  Watcher is already running');
      return;
    }

    console.log('🚀 Starting Content Watcher...');
    
    // Initial sync
    console.log('🔄 Performing initial content sync...');
    try {
      syncIntelligenceContent();
      console.log('✅ Initial sync completed');
    } catch (error) {
      console.error('❌ Initial sync failed:', error.message);
    }

    // Start watching
    this.watchContent();
    this.watchReports();
    
    this.isWatching = true;
    console.log('✅ Content Watcher is now running');
    console.log('📝 Watching for changes in content and reports directories...');
    console.log('🛑 Press Ctrl+C to stop watching');
  }

  // Stop watching
  stop() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    
    // Close all watchers
    this.watchers.forEach(watcher => {
      try {
        watcher.close();
      } catch (error) {
        console.warn('Warning: Error closing watcher:', error.message);
      }
    });
    
    this.watchers = [];
    this.isWatching = false;
    console.log('🛑 Content Watcher stopped');
  }
}

// Global watcher instance
let globalWatcher = null;

// Start the watcher
globalWatcher = new ContentWatcher();
globalWatcher.start();

console.log('👀 Content watcher is now running...');
console.log('📁 Watching directories:');
console.log(`   - ${CONTENT_DIR}`);
console.log(`   - ${REPORTS_DIR}`);
console.log('🔄 File changes will trigger automatic sync');
console.log('⏹️  Press Ctrl+C to stop watching\n');

// Keep the process alive
setInterval(() => {
  // This keeps the process running
}, 1000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping content watcher...');
  if (globalWatcher) {
    globalWatcher.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping content watcher...');
  if (globalWatcher) {
    globalWatcher.stop();
  }
  process.exit(0);
});

export { ContentWatcher };