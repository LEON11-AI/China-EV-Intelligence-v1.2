import React, { useState, useEffect, useRef } from 'react';
import { Clock, Search, TrendingUp, X } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'suggestion' | 'trending';
  count?: number;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  onClear?: () => void;
  isVisible: boolean;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSelect,
  onClear,
  isVisible,
  className = ''
}) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock trending searches and popular terms
  const trendingSearches = [
    'Tesla Model 3 sales',
    'BYD market share',
    'EV charging infrastructure',
    'NIO battery technology',
    'XPeng autonomous driving',
    'Li Auto range extender',
    'Lucid Air pricing',
    'Rivian delivery updates'
  ];

  const popularSuggestions = [
    'Tesla', 'BYD', 'NIO', 'XPeng', 'Li Auto', 'Lucid Motors', 'Rivian',
    'Model 3', 'Model Y', 'Model S', 'Han EV', 'Tang EV', 'ES8', 'ES6',
    'P7', 'G9', 'Li ONE', 'Air Dream', 'R1T', 'R1S',
    'sales data', 'market share', 'charging network', 'battery technology',
    'autonomous driving', 'range', 'pricing', 'delivery', 'production',
    'quarterly report', 'financial results', 'stock price'
  ];

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show recent searches and trending when no query
      const recentSuggestions: SearchSuggestion[] = searchHistory
        .slice(0, 5)
        .map((item, index) => ({
          id: `history-${index}`,
          text: item,
          type: 'history'
        }));

      const trendingSuggestions: SearchSuggestion[] = trendingSearches
        .slice(0, 5)
        .map((item, index) => ({
          id: `trending-${index}`,
          text: item,
          type: 'trending',
          count: Math.floor(Math.random() * 1000) + 100
        }));

      setSuggestions([...recentSuggestions, ...trendingSuggestions]);
    } else {
      // Filter suggestions based on query
      const queryLower = query.toLowerCase();
      
      const historySuggestions: SearchSuggestion[] = searchHistory
        .filter(item => item.toLowerCase().includes(queryLower))
        .slice(0, 3)
        .map((item, index) => ({
          id: `history-${index}`,
          text: item,
          type: 'history'
        }));

      const matchingSuggestions: SearchSuggestion[] = popularSuggestions
        .filter(item => item.toLowerCase().includes(queryLower))
        .slice(0, 7)
        .map((item, index) => ({
          id: `suggestion-${index}`,
          text: item,
          type: 'suggestion'
        }));

      setSuggestions([...historySuggestions, ...matchingSuggestions]);
    }
  }, [query, searchHistory]);

  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updatedHistory = [
      searchTerm,
      ...searchHistory.filter(item => item !== searchTerm)
    ].slice(0, 20); // Keep only last 20 searches

    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const removeHistoryItem = (itemToRemove: string) => {
    const updatedHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    saveToHistory(suggestion.text);
    onSelect(suggestion.text);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'history':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${className}`}
    >
      {/* Header */}
      {!query.trim() && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              {searchHistory.length > 0 ? 'Recent Searches' : 'Trending Searches'}
            </h3>
            {searchHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Suggestions List */}
      <div className="py-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            className="group flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getIcon(suggestion.type)}
              <span className="text-sm text-gray-700 truncate">
                {suggestion.text}
              </span>
              {suggestion.type === 'trending' && suggestion.count && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {suggestion.count}+ searches
                </span>
              )}
            </div>
            
            {suggestion.type === 'history' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistoryItem(suggestion.text);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all duration-150"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {query.trim() && suggestions.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-500">
          No suggestions found for "{query}"
        </div>
      )}

      {!query.trim() && suggestions.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {searchHistory.length > 0 
              ? 'Your search history is stored locally and can be cleared anytime'
              : 'Start typing to see personalized suggestions'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;