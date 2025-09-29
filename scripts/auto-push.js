#!/usr/bin/env node

/**
 * Auto Push Script for CMS Content
 * 
 * This script automatically commits and pushes changes made through the CMS
 * to the GitHub repository, enabling automatic deployment.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoPush {
  constructor() {
    this.projectRoot = process.cwd();
    this.contentDir = path.join(this.projectRoot, 'content');
    this.publicDir = path.join(this.projectRoot, 'public');
  }

  /**
   * Check if there are any changes to commit
   */
  hasChanges() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return status.trim().length > 0;
    } catch (error) {
      console.error('❌ Error checking git status:', error.message);
      return false;
    }
  }

  /**
   * Get the list of changed files
   */
  getChangedFiles() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return status.trim().split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('❌ Error getting changed files:', error.message);
      return [];
    }
  }

  /**
   * Generate a commit message based on changed files
   */
  generateCommitMessage(changedFiles) {
    const contentChanges = changedFiles.filter(file => 
      file.includes('content/') || file.includes('public/data/')
    );
    
    if (contentChanges.length === 0) {
      return 'chore: update project files';
    }

    const hasNewContent = contentChanges.some(file => file.startsWith('A '));
    const hasModifiedContent = contentChanges.some(file => file.startsWith('M '));
    const hasDeletedContent = contentChanges.some(file => file.startsWith('D '));

    let message = 'content: ';
    const actions = [];

    if (hasNewContent) actions.push('add new articles');
    if (hasModifiedContent) actions.push('update existing content');
    if (hasDeletedContent) actions.push('remove content');

    message += actions.join(', ');
    
    // Add timestamp for uniqueness
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    message += ` (${timestamp})`;

    return message;
  }

  /**
   * Execute git commands to commit and push changes
   */
  async pushChanges() {
    try {
      console.log('🔄 Starting auto-push process...');

      // Check if there are changes
      if (!this.hasChanges()) {
        console.log('✅ No changes to push');
        return true;
      }

      const changedFiles = this.getChangedFiles();
      console.log('📝 Changed files:', changedFiles.length);
      changedFiles.forEach(file => console.log(`   ${file}`));

      // Add all changes
      console.log('📦 Adding changes to git...');
      execSync('git add .', { stdio: 'inherit' });

      // Generate commit message
      const commitMessage = this.generateCommitMessage(changedFiles);
      console.log('💬 Commit message:', commitMessage);

      // Commit changes
      console.log('💾 Committing changes...');
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

      // Push to remote
      console.log('🚀 Pushing to remote repository...');
      execSync('git push origin main', { stdio: 'inherit' });

      console.log('✅ Auto-push completed successfully!');
      console.log('🌐 Changes will be deployed automatically via GitHub Actions');
      
      return true;
    } catch (error) {
      console.error('❌ Auto-push failed:', error.message);
      return false;
    }
  }

  /**
   * Watch for changes and auto-push
   */
  startWatching() {
    console.log('👀 Starting auto-push watcher...');
    console.log('📁 Watching directories:');
    console.log(`   - ${this.contentDir}`);
    console.log(`   - ${this.publicDir}/data`);
    console.log('⚡ Changes will be automatically pushed to GitHub');
    
    // Initial push if there are pending changes
    setTimeout(() => {
      this.pushChanges();
    }, 1000);

    // Set up periodic check (every 30 seconds)
    setInterval(() => {
      if (this.hasChanges()) {
        console.log('\n🔔 Changes detected, initiating auto-push...');
        this.pushChanges();
      }
    }, 30000);
  }
}

// Handle script execution
if (require.main === module) {
  const autoPush = new AutoPush();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'watch':
      autoPush.startWatching();
      break;
    case 'push':
      autoPush.pushChanges();
      break;
    default:
      console.log('📖 Usage:');
      console.log('  node scripts/auto-push.js push   - Push current changes');
      console.log('  node scripts/auto-push.js watch  - Start watching for changes');
      break;
  }
}

module.exports = AutoPush;