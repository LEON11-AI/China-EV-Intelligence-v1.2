// Script to clear ContentService cache and force data reload
// Run this in browser console to clear cache immediately

(function() {
    console.log('🔄 Clearing ContentService cache...');
    
    // Try to access ContentService instance and clear cache
    if (window.contentService) {
        window.contentService.clearCache();
        console.log('✅ ContentService cache cleared via window.contentService');
    }
    
    // Clear browser caches
    if ('caches' in window) {
        caches.keys().then(function(names) {
            names.forEach(function(name) {
                caches.delete(name);
            });
            console.log('✅ Browser caches cleared');
        });
    }
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Local and session storage cleared');
    
    // Force reload intelligence data
    console.log('🔄 Force reloading intelligence data...');
    
    // Test direct JSON fetch
    fetch('/data/intelligence.json?' + Date.now())
        .then(response => response.json())
        .then(data => {
            console.log('📊 Latest intelligence data:', data.length + ' articles');
            console.log('📋 Article IDs:', data.map(a => a.id));
            
            // Check for specific articles
            const nioAnalysis = data.find(a => a.id === 'nio-et7-2024-analysis');
            if (nioAnalysis) {
                console.log('✅ Found NIO ET7 analysis article:', nioAnalysis.title);
            } else {
                console.log('❌ NIO ET7 analysis article not found');
            }
            
            // Trigger page refresh after cache clear
            console.log('🔄 Refreshing page in 2 seconds...');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error('❌ Error loading intelligence data:', error);
        });
})();

console.log('Cache clearing script loaded. The page will refresh automatically in 2 seconds.');