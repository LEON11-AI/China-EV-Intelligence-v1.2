// Analytics utility functions

export interface ViewRecord {
  articleId: string;
  timestamp: number;
  userAgent: string;
}

export interface ArticleStats {
  id: string;
  title: string;
  views: number;
  lastViewed: number;
  dailyViews: { [date: string]: number };
}

export interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  articles: { [id: string]: ArticleStats };
  lastUpdated: number;
}

const STORAGE_KEY = 'china_ev_analytics';
const VIEW_RECORDS_KEY = 'china_ev_view_records';
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours

// Get current date string
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Get user identifier (based on browser fingerprint)
function getUserFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Check if in cooldown period
function isInCooldown(articleId: string): boolean {
  try {
    const records = JSON.parse(localStorage.getItem(VIEW_RECORDS_KEY) || '[]') as ViewRecord[];
    const userFingerprint = getUserFingerprint();
    const now = Date.now();
    
    const recentView = records.find(record => 
      record.articleId === articleId && 
      record.userAgent === userFingerprint &&
      (now - record.timestamp) < COOLDOWN_PERIOD
    );
    
    return !!recentView;
  } catch (error) {
    console.error('Error checking cooldown period:', error);
    return false;
  }
}

// Record view
function recordView(articleId: string): void {
  try {
    const records = JSON.parse(localStorage.getItem(VIEW_RECORDS_KEY) || '[]') as ViewRecord[];
    const userFingerprint = getUserFingerprint();
    const now = Date.now();
    
    // Add new record
    records.push({
      articleId,
      timestamp: now,
      userAgent: userFingerprint
    });
    
    // Clean up records older than 30 days
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const cleanedRecords = records.filter(record => record.timestamp > thirtyDaysAgo);
    
    localStorage.setItem(VIEW_RECORDS_KEY, JSON.stringify(cleanedRecords));
  } catch (error) {
    console.error('Error recording view:', error);
  }
}

// Get analytics data
export function getAnalyticsData(): AnalyticsData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error getting analytics data:', error);
  }
  
  return {
    totalViews: 0,
    totalArticles: 0,
    articles: {},
    lastUpdated: Date.now()
  };
}

// Save analytics data
function saveAnalyticsData(data: AnalyticsData): void {
  try {
    data.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving analytics data:', error);
  }
}

// Increment article view count
export function incrementViewCount(articleId: string, articleTitle: string): boolean {
  // Check if in cooldown period
  if (isInCooldown(articleId)) {
    return false;
  }
  
  try {
    const data = getAnalyticsData();
    const today = getCurrentDate();
    
    // Initialize article statistics
    if (!data.articles[articleId]) {
      data.articles[articleId] = {
        id: articleId,
        title: articleTitle,
        views: 0,
        lastViewed: 0,
        dailyViews: {}
      };
      data.totalArticles++;
    }
    
    // Update statistics
    data.articles[articleId].views++;
    data.articles[articleId].lastViewed = Date.now();
    data.articles[articleId].dailyViews[today] = (data.articles[articleId].dailyViews[today] || 0) + 1;
    data.totalViews++;
    
    // Record view
    recordView(articleId);
    
    // Save data
    saveAnalyticsData(data);
    
    return true;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return false;
  }
}

// Get article view count
export function getArticleViews(articleId: string): number {
  const data = getAnalyticsData();
  return data.articles[articleId]?.views || 0;
}

// Get popular articles
export function getPopularArticles(limit: number = 10): ArticleStats[] {
  const data = getAnalyticsData();
  return Object.values(data.articles)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Get recent articles
export function getRecentArticles(limit: number = 10): ArticleStats[] {
  const data = getAnalyticsData();
  return Object.values(data.articles)
    .sort((a, b) => b.lastViewed - a.lastViewed)
    .slice(0, limit);
}

// Get today's statistics
export function getTodayStats(): { views: number; articles: number } {
  const data = getAnalyticsData();
  const today = getCurrentDate();
  
  let todayViews = 0;
  let todayArticles = 0;
  
  Object.values(data.articles).forEach(article => {
    const dailyViews = article.dailyViews[today] || 0;
    if (dailyViews > 0) {
      todayViews += dailyViews;
      todayArticles++;
    }
  });
  
  return { views: todayViews, articles: todayArticles };
}

// Export data
export function exportAnalyticsData(): string {
  const data = getAnalyticsData();
  return JSON.stringify(data, null, 2);
}

// Clear all data
export function clearAnalyticsData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VIEW_RECORDS_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}