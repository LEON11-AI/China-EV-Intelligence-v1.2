import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAnalyticsData, 
  getTodayStats, 
  getPopularArticles, 
  getRecentArticles,
  exportAnalyticsData,
  clearAnalyticsData,
  AnalyticsData 
} from '../utils/analytics';
import { PopularArticles } from '../components/PopularArticles';
import { 
  Eye, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Download, 
  Trash2,
  Users,
  FileText,
  Activity,
  Lock,
  Shield
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div className={`bg-dark-card p-6 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-text-main mt-1">{value}</p>
          {trend && (
            <p className="text-green-400 text-sm mt-1">{trend}</p>
          )}
        </div>
        <div className="text-cta-orange">
          {icon}
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [todayStats, setTodayStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // 管理员密码
  const ADMIN_PASSWORD = 'Admin2024!';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [data, today] = await Promise.all([
          getAnalyticsData(),
          getTodayStats()
        ]);
        setAnalyticsData(data);
        setTodayStats(today);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('密码错误，请重试');
      setPassword('');
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
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
      console.error('Error exporting data:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsClearing(true);
      await clearAnalyticsData();
      // Refresh data
      const [data, today] = await Promise.all([
        getAnalyticsData(),
        getTodayStats()
      ]);
      setAnalyticsData(data);
      setTodayStats(today);
    } catch (err) {
      console.error('Error clearing data:', err);
    } finally {
      setIsClearing(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // 如果未认证，显示密码输入界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-dark-card p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-cta-orange/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-cta-orange" />
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-2">管理员验证</h2>
              <p className="text-text-secondary">请输入管理员密码以访问Analytics Dashboard</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-main mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-cta-orange focus:border-transparent"
                    placeholder="请输入管理员密码"
                    required
                  />
                </div>
                {authError && (
                  <p className="mt-2 text-sm text-red-500">{authError}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-cta-orange hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cta-orange focus:ring-offset-2 focus:ring-offset-dark-card"
              >
                验证并进入
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-link-blue hover:text-link-hover text-sm font-medium"
              >
                ← 返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-800 rounded-lg"></div>
            <div className="h-96 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-cta-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Analytics Dashboard</h1>
          <p className="text-text-secondary">Track your content performance and user engagement</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
          </button>
          <button
            onClick={handleClearData}
            disabled={isClearing}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isClearing ? 'Clearing...' : 'Clear Data'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Page Views"
          value={formatNumber(analyticsData?.totalViews || 0)}
          icon={<Eye className="w-8 h-8" />}
          trend={todayStats?.views ? `+${todayStats.views} today` : undefined}
        />
        <StatsCard
          title="Total Articles"
          value={analyticsData?.totalArticles || 0}
          icon={<FileText className="w-8 h-8" />}
        />
        <StatsCard
          title="Unique Visitors"
          value={formatNumber(analyticsData?.uniqueVisitors || 0)}
          icon={<Users className="w-8 h-8" />}
          trend={todayStats?.uniqueVisitors ? `+${todayStats.uniqueVisitors} today` : undefined}
        />
        <StatsCard
          title="Avg. Views/Article"
          value={analyticsData?.totalArticles ? 
            Math.round((analyticsData.totalViews || 0) / analyticsData.totalArticles) : 0}
          icon={<Activity className="w-8 h-8" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Articles */}
        <div className="bg-dark-card p-6 rounded-lg shadow-lg">
          <PopularArticles 
            limit={10} 
            variant="detailed" 
            className="" 
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-dark-card p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 mr-2 text-cta-orange" />
            <h3 className="text-lg font-semibold text-text-main">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {analyticsData?.lastUpdated && (
              <div className="text-sm text-text-secondary">
                <p>Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}</p>
              </div>
            )}
            
            {todayStats && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-medium text-text-main mb-2">Today's Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Views:</span>
                    <span className="text-text-main ml-2 font-medium">{todayStats.views || 0}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Visitors:</span>
                    <span className="text-text-main ml-2 font-medium">{todayStats.uniqueVisitors || 0}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center pt-4">
              <Link
                to="/"
                className="text-link-blue hover:text-link-hover text-sm font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="mt-8 bg-dark-card p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-text-main mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
          <div>
            <h4 className="font-medium text-text-main mb-2">Storage Information</h4>
            <p>Data is stored locally in your browser's localStorage.</p>
            <p>Export data regularly to prevent loss.</p>
          </div>
          <div>
            <h4 className="font-medium text-text-main mb-2">Privacy</h4>
            <p>All analytics data is processed locally.</p>
            <p>No personal information is collected or transmitted.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;