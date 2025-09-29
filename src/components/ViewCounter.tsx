import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { incrementViewCount, getArticleViews } from '../utils/analytics';

interface ViewCounterProps {
  articleId: string;
  articleTitle: string;
  className?: string;
  showIcon?: boolean;
  autoIncrement?: boolean;
}

const ViewCounter: React.FC<ViewCounterProps> = ({
  articleId,
  articleTitle,
  className = '',
  showIcon = true,
  autoIncrement = true
}) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current view count
    const currentViews = getArticleViews(articleId);
    setViewCount(currentViews);
    setIsLoading(false);

    // Auto increment view count (if enabled)
    if (autoIncrement) {
      const timer = setTimeout(() => {
        const success = incrementViewCount(articleId, articleTitle);
        if (success) {
          setViewCount(prev => prev + 1);
        }
      }, 1000); // 延迟1秒统计，确保用户真实访问

      return () => clearTimeout(timer);
    }
  }, [articleId, articleTitle, autoIncrement]);

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center text-gray-500 ${className}`}>
        {showIcon && <Eye className="w-4 h-4 mr-1" />}
        <span className="text-sm">--</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center text-gray-600 ${className}`}>
      {showIcon && <Eye className="w-4 h-4 mr-1" />}
      <span className="text-sm font-medium">
        {formatNumber(viewCount)}
      </span>
      <span className="text-xs ml-1 hidden sm:inline">views</span>
    </div>
  );
};

export default ViewCounter;