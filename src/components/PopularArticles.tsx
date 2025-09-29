import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularArticles, ArticleStats } from '../utils/analytics';
import { Eye, TrendingUp, Calendar } from 'lucide-react';

interface PopularArticlesProps {
  limit?: number;
  showViewCount?: boolean;
  className?: string;
  variant?: 'compact' | 'detailed';
}

interface ArticleWithStats extends ArticleStats {
  title?: string;
  date?: string;
  brand?: string;
  summary?: string;
}

export const PopularArticles: React.FC<PopularArticlesProps> = ({
  limit = 5,
  showViewCount = true,
  className = '',
  variant = 'detailed'
}) => {
  const [popularArticles, setPopularArticles] = useState<ArticleWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        setLoading(true);
        const articles = await getPopularArticles(limit);
        
        // 模拟获取文章详细信息（在实际应用中，这里应该调用内容服务）
        const articlesWithDetails = articles.map(article => ({
          ...article,
          title: `Article ${article.articleId}`,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          brand: ['Tesla', 'BYD', 'NIO', 'XPeng', 'Li Auto'][Math.floor(Math.random() * 5)],
          summary: `This is a summary for article ${article.articleId}. It contains important insights about the EV industry.`
        }));
        
        setPopularArticles(articlesWithDetails);
      } catch (err) {
        setError('Failed to load popular articles');
        console.error('Error fetching popular articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArticles();
  }, [limit]);

  const formatViewCount = (count: number | undefined): string => {
    if (!count || count === undefined) {
      return '0';
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-gray-800 h-16 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-center p-4 ${className}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (popularArticles.length === 0) {
    return (
      <div className={`text-text-secondary text-center p-4 ${className}`}>
        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No popular articles yet</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 mr-2 text-cta-orange" />
        <h3 className="text-lg font-semibold text-text-main">Popular Articles</h3>
      </div>
      
      <div className="space-y-3">
        {popularArticles.map((article, index) => (
          <Link
            key={article.articleId}
            to={`/intelligence/${article.articleId}`}
            className="block group hover:bg-gray-800/50 p-3 rounded-lg transition-colors duration-200"
          >
            {variant === 'compact' ? (
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary mb-1">
                    <span className="bg-cta-orange text-white text-xs px-2 py-0.5 rounded font-bold">
                      #{index + 1}
                    </span>
                    <span>{article.brand}</span>
                  </div>
                  <h4 className="text-text-main font-medium truncate group-hover:text-link-blue transition-colors">
                    {article.title}
                  </h4>
                </div>
                {showViewCount && (
                  <div className="flex items-center text-text-secondary text-sm ml-3">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{formatViewCount(article.views)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <span className="bg-cta-orange text-white text-xs px-2 py-0.5 rounded font-bold">
                      #{index + 1}
                    </span>
                    <span>{article.brand}</span>
                    <span>&middot;</span>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  {showViewCount && (
                    <div className="flex items-center text-text-secondary text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{formatViewCount(article.views)}</span>
                    </div>
                  )}
                </div>
                <h4 className="text-text-main font-medium mb-1 group-hover:text-link-blue transition-colors">
                  {article.title}
                </h4>
                <p className="text-text-secondary text-sm line-clamp-2">
                  {article.summary}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
      
      {popularArticles.length >= limit && (
        <div className="mt-4 text-center">
          <Link
            to="/analytics"
            className="text-link-blue hover:text-link-hover text-sm font-medium"
          >
            View All Analytics →
          </Link>
        </div>
      )}
    </div>
  );
};

export default PopularArticles;