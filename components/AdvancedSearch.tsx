import React, { useState } from 'react';
import { ChevronDown, Filter, X, Search } from 'lucide-react';

interface SearchFilters {
  contentType: 'all' | 'intelligence' | 'models';
  brand: string;
  dateRange: 'all' | 'week' | 'month' | 'quarter' | 'year';
  priceRange: [number, number];
  status: 'all' | 'active' | 'discontinued';
  isPro: boolean | null;
  sortBy: 'relevance' | 'date' | 'price' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  initialQuery?: string;
  isLoading?: boolean;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  initialQuery = '',
  isLoading = false,
  className = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    contentType: 'all',
    brand: '',
    dateRange: 'all',
    priceRange: [0, 200000],
    status: 'all',
    isPro: null,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const brands = [
    'Tesla', 'BYD', 'NIO', 'XPeng', 'Li Auto', 'Lucid Motors',
    'Rivian', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen',
    'Ford', 'GM', 'Hyundai', 'Kia', 'Toyota', 'Honda'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (query.trim()) {
      onSearch(query, newFilters);
    }
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      contentType: 'all',
      brand: '',
      dateRange: 'all',
      priceRange: [0, 200000],
      status: 'all',
      isPro: null,
      sortBy: 'relevance',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    if (query.trim()) {
      onSearch(query, defaultFilters);
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.contentType !== 'all' ||
      filters.brand !== '' ||
      filters.dateRange !== 'all' ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 200000 ||
      filters.status !== 'all' ||
      filters.isPro !== null ||
      filters.sortBy !== 'relevance'
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search intelligence, models, brands..."
              className="w-full px-4 py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 ${
              hasActiveFilters() ? 'bg-blue-50 border-blue-300 text-blue-700' : 'text-gray-700'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters() && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {Object.values(filters).filter(v => v !== 'all' && v !== '' && v !== null && (Array.isArray(v) ? v[0] !== 0 || v[1] !== 200000 : true)).length}
              </span>
            )}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <X className="h-3 w-3" />
                  <span>Clear all</span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={filters.contentType}
                onChange={(e) => handleFilterChange('contentType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Content</option>
                <option value="intelligence">Intelligence Articles</option>
                <option value="models">Vehicle Models</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="quarter">Past Quarter</option>
                <option value="year">Past Year</option>
              </select>
            </div>

            {/* Status (for models) */}
            {(filters.contentType === 'all' || filters.contentType === 'models') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            )}

            {/* Pro Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Access
              </label>
              <select
                value={filters.isPro === null ? 'all' : filters.isPro ? 'pro' : 'free'}
                onChange={(e) => {
                  const value = e.target.value === 'all' ? null : e.target.value === 'pro';
                  handleFilterChange('isPro', value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Content</option>
                <option value="free">Free Content</option>
                <option value="pro">PRO Content</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="price">Price</option>
                  <option value="popularity">Popularity</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Range (for models) */}
          {(filters.contentType === 'all' || filters.contentType === 'models') && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (USD): ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={filters.priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= filters.priceRange[1]) {
                      handleFilterChange('priceRange', [newMin, filters.priceRange[1]]);
                    }
                  }}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= filters.priceRange[0]) {
                      handleFilterChange('priceRange', [filters.priceRange[0], newMax]);
                    }
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;