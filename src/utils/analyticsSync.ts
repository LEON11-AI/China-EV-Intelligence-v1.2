// Analytics data synchronization service

import { AnalyticsData, getAnalyticsData } from './analytics';

// Sync data to server (simulated)
export async function syncAnalyticsToServer(): Promise<boolean> {
  try {
    const data = getAnalyticsData();
    
    // In real applications, this would send to server API
    // Now we save data to JSON file in public directory
    const response = await fetch('/api/analytics/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to sync data to server:', error);
    
    // If API is unavailable, try to save to local file
    try {
      await saveToLocalFile(getAnalyticsData());
      return true;
    } catch (fileError) {
      console.error('Failed to save to local file:', fileError);
      return false;
    }
  }
}

// Save data to local file
async function saveToLocalFile(data: AnalyticsData): Promise<void> {
  // Create download link
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL
  URL.revokeObjectURL(url);
}

// Load data from server
export async function loadAnalyticsFromServer(): Promise<AnalyticsData | null> {
  try {
    const response = await fetch('/api/analytics/data');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to load data from server:', error);
  }
  
  return null;
}

// Merge local and server data
export function mergeAnalyticsData(localData: AnalyticsData, serverData: AnalyticsData): AnalyticsData {
  const merged: AnalyticsData = {
    totalViews: 0,
    totalArticles: 0,
    articles: {},
    lastUpdated: Math.max(localData.lastUpdated, serverData.lastUpdated)
  };
  
  // Merge article data
  const allArticleIds = new Set([
    ...Object.keys(localData.articles),
    ...Object.keys(serverData.articles)
  ]);
  
  allArticleIds.forEach(articleId => {
    const local = localData.articles[articleId];
    const server = serverData.articles[articleId];
    
    if (local && server) {
      // Merge two data sources
      merged.articles[articleId] = {
        id: articleId,
        title: local.title || server.title,
        views: Math.max(local.views, server.views),
        lastViewed: Math.max(local.lastViewed, server.lastViewed),
        dailyViews: { ...server.dailyViews, ...local.dailyViews }
      };
    } else {
      // Use available data source
      merged.articles[articleId] = local || server;
    }
  });
  
  // Recalculate totals
  merged.totalArticles = Object.keys(merged.articles).length;
  merged.totalViews = Object.values(merged.articles).reduce(
    (total, article) => total + article.views,
    0
  );
  
  return merged;
}

// Auto sync service
class AnalyticsSyncService {
  private syncInterval: number | null = null;
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  start(): void {
    if (this.syncInterval) {
      return; // Already started
    }
    
    // Perform sync immediately
    this.performSync();
    
    // Set up periodic sync
    this.syncInterval = window.setInterval(() => {
      this.performSync();
    }, this.SYNC_INTERVAL);
    
    console.log('Analytics data sync service started');
  }
  
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Analytics data sync service stopped');
    }
  }
  
  private async performSync(): Promise<void> {
    try {
      const success = await syncAnalyticsToServer();
      if (success) {
        console.log('Data sync successful');
      } else {
        console.warn('Data sync failed');
      }
    } catch (error) {
      console.error('Error during sync process:', error);
    }
  }
  
  // Manually trigger sync
  async manualSync(): Promise<boolean> {
    return await syncAnalyticsToServer();
  }
}

// Export singleton instance
export const syncService = new AnalyticsSyncService();

// Sync data when page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    syncAnalyticsToServer();
  });
  
  // Sync when page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      syncAnalyticsToServer();
    }
  });
}