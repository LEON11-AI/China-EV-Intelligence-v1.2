// Script to clear frontend cache and reload data
// Run this in browser console to force cache refresh

// Get ContentService instance and clear cache
if (window.contentService) {
  window.contentService.clearCache();
  console.log('Cache cleared successfully');
} else {
  console.log('ContentService not found on window object');
}

// Force reload the page
window.location.reload();