import React, { useState, useEffect } from 'react';
import ContentService from '../src/services/ContentService';
import type { IntelligenceItem, ModelItem } from '../src/services/ContentService';
import { formatDateSmart } from '../src/services/DateUtils';
import { getTodayStats, getPopularArticles, exportAnalyticsData, clearAnalyticsData } from '../src/utils/analytics';
import { BarChart3, Download, Trash2, Eye, TrendingUp } from 'lucide-react';

const CMSTest: React.FC = () => {
  const [intelligence, setIntelligence] = useState<IntelligenceItem[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsStats, setAnalyticsStats] = useState<any>(null);
  const [popularArticles, setPopularArticles] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const contentService = new ContentService();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [intelligenceData, modelsData] = await Promise.all([
          contentService.getIntelligence(),
          contentService.getModels()
        ]);
        
        setIntelligence(intelligenceData.slice(0, 3)); // Show first 3 items
        setModels(modelsData.slice(0, 3)); // Show first 3 items
        
        // Load analytics data
        await loadAnalyticsData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true);
      const [stats, popular] = await Promise.all([
        getTodayStats(),
        getPopularArticles(5)
      ]);
      setAnalyticsStats(stats);
      setPopularArticles(popular);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportAnalyticsData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('导出失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  const handleClearData = async () => {
    if (confirm('确定要清除所有阅读量统计数据吗？此操作不可撤销。')) {
      try {
        await clearAnalyticsData();
        await loadAnalyticsData(); // Reload data
        alert('数据已清除');
      } catch (err) {
        alert('清除失败: ' + (err instanceof Error ? err.message : '未知错误'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CMS data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">CMS Integration Test</h1>
          <p className="text-gray-600">Testing data loading from CMS backend</p>
        </div>

        {/* Intelligence Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Intelligence Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {intelligence.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">{item.brand}</span>
                    {item.is_pro && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        PRO
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.summary}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDateSmart(item.date)}</span>
                    <span className="capitalize">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Models Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Models</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {models.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {item.images && item.images[0] && (
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">{item.brand}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'coming_soon' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  {item.key_specs && (
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Range: {item.key_specs.range_km}km</p>
                      <p>Battery: {item.key_specs.battery_kwh}kWh</p>
                    </div>
                  )}
                  {item.price_usd_estimated && item.price_usd_estimated.length > 0 && (
                    <p className="text-lg font-bold text-green-600">
                      ${item.price_usd_estimated[0].toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Management Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            阅读量统计管理
          </h2>
          
          {analyticsLoading ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">加载统计数据中...</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Statistics Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  统计概览
                </h3>
                {analyticsStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analyticsStats.totalViews}</div>
                      <div className="text-sm text-blue-700">总浏览量</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analyticsStats.totalArticles}</div>
                      <div className="text-sm text-green-700">文章总数</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analyticsStats.uniqueVisitors}</div>
                      <div className="text-sm text-purple-700">独立访客</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{analyticsStats.avgViewsPerArticle}</div>
                      <div className="text-sm text-orange-700">平均阅读量</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">暂无统计数据</p>
                )}
              </div>

              {/* Popular Articles */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  热门文章
                </h3>
                {popularArticles.length > 0 ? (
                  <div className="space-y-3">
                    {popularArticles.map((article, index) => (
                      <div key={article.articleId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold mr-2">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-gray-700">{article.articleId}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{article.viewCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">暂无热门文章</p>
                )}
              </div>
            </div>
          )}

          {/* Management Actions */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清除数据
              </button>
              <button
                onClick={loadAnalyticsData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                刷新数据
              </button>
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Data Source Information</h3>
          <p className="text-blue-700 text-sm">
            This page demonstrates the CMS integration. Data is loaded from the ContentService which 
            attempts to fetch from CMS API endpoints (/api/cms/intelligence and /api/cms/models) 
            and falls back to JSON files if CMS is unavailable.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-blue-900">Intelligence Articles:</strong> {intelligence.length} loaded
            </div>
            <div>
              <strong className="text-blue-900">Vehicle Models:</strong> {models.length} loaded
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSTest;