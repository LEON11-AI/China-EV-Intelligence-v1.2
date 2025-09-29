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
const HTML_REPORTS_FILE = path.join(__dirname, '..', 'public', 'data', 'html_reports.json');
const REPORTS_DIR = path.join(__dirname, '..', 'public', 'reports');

// Function to read markdown files and convert to JSON
function syncIntelligenceContent() {
  console.log('🔄 Starting content synchronization...');
  console.log('📁 CONTENT_DIR:', CONTENT_DIR);
  console.log('📁 REPORTS_DIR:', REPORTS_DIR);
  console.log('📄 DATA_FILE:', DATA_FILE);
  console.log('📄 HTML_REPORTS_FILE:', HTML_REPORTS_FILE);
  
  const intelligenceData = [];
  const htmlReportsData = [];
  let publishedCount = 0;
  let unpublishedCount = 0;
  
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
        publishedCount++;
        console.log(`✅ Published: ${data.title || file}`);
      } else {
        unpublishedCount++;
        console.log(`⏸️  Unpublished: ${data.title || file}`);
      }
    });
  }
  
  // Read HTML reports
  if (fs.existsSync(REPORTS_DIR)) {
    console.log('Reading reports directory:', REPORTS_DIR);
    const reportFiles = fs.readdirSync(REPORTS_DIR).filter(file => file.endsWith('.md'));
    console.log('Found report files:', reportFiles);
    
    reportFiles.forEach(file => {
      const filePath = path.join(REPORTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      console.log(`Processing file: ${file}`);
      console.log(`File data:`, data);
      
      // Check if this is an HTML report
      if (data.type === 'html_report' && (data.html_file || data.raw_html_content)) {
        console.log(`Found HTML report: ${file}`);
        const item = {
          id: data.id || (file === 'test-html-report.md' ? 'test_001' : file.replace('.md', '')),
          title: data.title || '',
          date: data.date ? (typeof data.date === 'string' ? data.date.split('T')[0] : new Date(data.date).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
          brand: data.brand || 'Industry',
          model: data.model || '',
          category: data.category || 'market_analysis',
          tags: data.tags || [],
          summary: data.summary || '',
          content: content,
          author: data.author || 'China EV Intelligence',
          read_time: data.reading_time || data.read_time || 10,
          importance: data.importance?.toLowerCase() || 'high',
          is_pro: data.is_pro !== false,
          confidence: data.confidence || 'high',
          source: data.source || 'China EV Intelligence',
          status: data.status || 'verified',
          featured: data.featured || false,
          html_file: data.html_file,
          raw_html_content: data.raw_html_content,
          content_type: 'html'
        };
        
        // Only include published content
        if (data.published !== false) {
          htmlReportsData.push(item);
          publishedCount++;
          console.log(`✅ Published HTML Report: ${data.title || file}`);
        } else {
          unpublishedCount++;
          console.log(`⏸️  Unpublished HTML Report: ${data.title || file}`);
        }
      }
    });
  }
  
  // Sort by date (newest first)
  intelligenceData.sort((a, b) => new Date(b.date) - new Date(a.date));
  htmlReportsData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Write to data files
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write intelligence data
  fs.writeFileSync(DATA_FILE, JSON.stringify(intelligenceData, null, 2));
  console.log(`📝 Synced ${intelligenceData.length} intelligence articles to ${DATA_FILE}`);
  
  // Write HTML reports data
  fs.writeFileSync(HTML_REPORTS_FILE, JSON.stringify(htmlReportsData, null, 2));
  console.log(`📊 Synced ${htmlReportsData.length} HTML reports to ${HTML_REPORTS_FILE}`);
  
  // Summary
  console.log(`\n📊 Sync Summary:`);
  console.log(`   ✅ Published: ${publishedCount}`);
  console.log(`   ⏸️  Unpublished: ${unpublishedCount}`);
  console.log(`   📝 Intelligence Articles: ${intelligenceData.length}`);
  console.log(`   📊 HTML Reports: ${htmlReportsData.length}`);
  console.log(`✅ Content synchronization completed successfully!\n`);
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

// Main execution - always run when script is executed directly
const command = process.argv[2];

if (command === 'watch') {
  syncIntelligenceContent();
  watchContent();
} else {
  syncIntelligenceContent();
}

export { syncIntelligenceContent };