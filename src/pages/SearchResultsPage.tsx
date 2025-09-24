import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { contentService, IntelligenceItem, ModelItem } from '../services/ContentService';
import AdvancedSearch from '../../components/AdvancedSearch';

interface SearchResult {
  type: 'intelligence' | 'model';
  item: IntelligenceItem | ModelItem;
  score?: number;
}

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

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    contentType: 'all',
    brand: '',
    dateRange: 'all',
    priceRange: [0, 200000],
    status: 'all',
    isPro: null,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  // Helper function to check for exact matches
  const isExactMatch = (result: SearchResult, query: string): boolean => {
    const searchTerm = query.toLowerCase().trim();
    
    if (result.type === 'intelligence') {
      const item = result.item as IntelligenceItem;
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.brand.toLowerCase() === searchTerm ||
        item.tags.some(tag => tag.toLowerCase() === searchTerm)
      );
    } else {
      const item = result.item as ModelItem;
      return (
        item.model_name.toLowerCase().includes(searchTerm) ||
        item.brand.toLowerCase() === searchTerm
      );
    }
  };

  const performSearch = async (searchQuery: string, filters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get all data
      const [intelligence, models] = await Promise.all([
        contentService.getIntelligence(),
        contentService.getModels()
      ]);

      // Apply content type filter
      let filteredIntelligence = intelligence;
      let filteredModels = models;

      if (filters.contentType === 'intelligence') {
        filteredModels = [];
      } else if (filters.contentType === 'models') {
        filteredIntelligence = [];
      }

      // Apply brand filter
      if (filters.brand) {
        filteredIntelligence = filteredIntelligence.filter(item => 
          item.brand.toLowerCase() === filters.brand.toLowerCase()
        );
        filteredModels = filteredModels.filter(item => 
          item.brand.toLowerCase() === filters.brand.toLowerCase()
        );
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filters.dateRange) {
          case 'week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            cutoffDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        filteredIntelligence = filteredIntelligence.filter(item => 
          new Date(item.date) >= cutoffDate
        );
      }

      // Apply status filter for models
      if (filters.status !== 'all') {
        filteredModels = filteredModels.filter(item => item.status === filters.status);
      }

      // Apply price range filter for models
      filteredModels = filteredModels.filter(item => {
        const minPrice = item.price_usd_estimated[0];
        const maxPrice = item.price_usd_estimated[1];
        return minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1];
      });

      // Apply pro content filter
      if (filters.isPro !== null) {
        filteredIntelligence = filteredIntelligence.filter(item => 
          item.is_pro === filters.isPro
        );
      }

      // Configure Fuse.js search options with improved precision
      const intelligenceOptions = {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'brand', weight: 0.3 },
          { name: 'summary', weight: 0.15 },
          { name: 'tags', weight: 0.05 }
        ],
        threshold: 0.25,
        includeScore: true,
        ignoreLocation: true,
        findAllMatches: true,
        minMatchCharLength: 2
      };

      const modelsOptions = {
        keys: [
          { name: 'model_name', weight: 0.5 },
          { name: 'brand', weight: 0.3 },
          { name: 'ceo_note', weight: 0.15 },
          { name: 'market_analysis.target_segment', weight: 0.05 }
        ],
        threshold: 0.25,
        includeScore: true,
        ignoreLocation: true,
        findAllMatches: true,
        minMatchCharLength: 2
      };

      // Execute search
      const intelligenceFuse = new Fuse(filteredIntelligence, intelligenceOptions);
      const modelsFuse = new Fuse(filteredModels, modelsOptions);

      const intelligenceResults = intelligenceFuse.search(searchQuery);
      const modelsResults = modelsFuse.search(searchQuery);

      // Merge and filter results by relevance score
      const maxRelevanceScore = 0.6; // Filter out results with score > 0.6 (lower is better in Fuse.js)
      
      let combinedResults: SearchResult[] = [
        ...intelligenceResults
          .filter(result => (result.score || 0) <= maxRelevanceScore)
          .map(result => ({
            type: 'intelligence' as const,
            item: result.item,
            score: result.score
          })),
        ...modelsResults
          .filter(result => (result.score || 0) <= maxRelevanceScore)
          .map(result => ({
            type: 'model' as const,
            item: result.item,
            score: result.score
          }))
      ];

      // Enhanced sorting with exact match priority
      combinedResults.sort((a, b) => {
        switch (filters.sortBy) {
          case 'relevance':
            // Check for exact matches first
            const aExactMatch = isExactMatch(a, searchQuery);
            const bExactMatch = isExactMatch(b, searchQuery);
            
            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
            
            // Then sort by relevance score (lower is better in Fuse.js)
            return (a.score || 0) - (b.score || 0);
          case 'date':
            const dateA = a.type === 'intelligence' 
              ? new Date((a.item as IntelligenceItem).date)
              : new Date(); // Models don't have dates, use current date
            const dateB = b.type === 'intelligence' 
              ? new Date((b.item as IntelligenceItem).date)
              : new Date();
            return filters.sortOrder === 'asc' 
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          case 'price':
            const priceA = a.type === 'model' 
              ? (a.item as ModelItem).price_usd_estimated[0]
              : 0;
            const priceB = b.type === 'model' 
              ? (b.item as ModelItem).price_usd_estimated[0]
              : 0;
            return filters.sortOrder === 'asc' 
              ? priceA - priceB
              : priceB - priceA;
          case 'popularity':
            // Mock popularity based on score for now
            return filters.sortOrder === 'asc' 
              ? (a.score || 0) - (b.score || 0)
              : (b.score || 0) - (a.score || 0);
          default:
            return 0;
        }
      });

      setResults(combinedResults);
      setTotalResults(combinedResults.length);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string, filters: SearchFilters) => {
    setCurrentFilters(filters);
    
    // Update URL with search query
    const newSearchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newSearchParams.set('q', searchQuery);
    }
    setSearchParams(newSearchParams);
    
    performSearch(searchQuery, filters);
  };

  useEffect(() => {
    performSearch(query, currentFilters);
  }, [query]);

  const renderIntelligenceResult = (item: IntelligenceItem) => (
    <div key={item.id} className="bg-dark-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-600">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="bg-link-blue bg-opacity-20 text-link-blue text-xs font-medium px-2.5 py-0.5 rounded">
            Intelligence
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {item.brand}
          </span>
          {item.is_pro && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              PRO
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">{item.date}</span>
      </div>
      
      <Link to={`/intelligence/${item.id}`} className="block">
        <h3 className="text-xl font-semibold text-text-main mb-2 hover:text-link-blue transition-colors">
          {item.title}
        </h3>
        <p className="text-text-secondary mb-3 line-clamp-3">{item.summary}</p>
      </Link>
      
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>Author: {item.author}</span>
          <span>Read time: {item.read_time} min</span>
        </div>
        <div className="flex space-x-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-gray-700 text-text-secondary px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModelResult = (item: ModelItem) => (
    <div key={item.id} className="bg-dark-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-600">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="bg-green-500 bg-opacity-20 text-green-400 text-xs font-medium px-2.5 py-0.5 rounded">
            Model
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {item.brand}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
            item.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {item.status}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          ${item.price_usd_estimated[0].toLocaleString()} - ${item.price_usd_estimated[1].toLocaleString()}
        </span>
      </div>
      
      <Link to={`/models/${item.id}`} className="block">
        <h3 className="text-xl font-semibold text-text-main mb-2 hover:text-link-blue transition-colors">
          {item.model_name}
        </h3>
        <p className="text-text-secondary mb-3 line-clamp-2">{item.ceo_note}</p>
      </Link>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-text-secondary">Range:</span>
          <span className="ml-1 font-medium">{item.key_specs.range_cltc}</span>
        </div>
        <div>
          <span className="text-text-secondary">0-100km/h:</span>
          <span className="ml-1 font-medium">{item.key_specs.zero_to_100}</span>
        </div>
        <div>
          <span className="text-text-secondary">Power:</span>
          <span className="ml-1 font-medium">{item.key_specs.power_kw}</span>
        </div>
        <div>
          <span className="text-text-secondary">Battery:</span>
          <span className="ml-1 font-medium">{item.key_specs.battery_kwh}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-blue mx-auto"></div>
            <p className="mt-4 text-text-secondary">Searching...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Advanced Search Component */}
        <div className="mb-8">
          <AdvancedSearch
            onSearch={handleSearch}
            initialQuery={query}
            isLoading={loading}
            className="mb-6"
          />
        </div>

        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-main mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-text-secondary">
              Results for "<span className="font-medium text-text-main">{query}</span>"
              {totalResults > 0 && (
                <span className="ml-2">({totalResults} results)</span>
              )}
            </p>
          )}
        </div>

        {/* Search Results List */}
        {!query.trim() ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-main mb-2">Please enter search keywords</h3>
              <p className="text-text-secondary">You can search for intelligence articles, vehicle models, brands and more</p>
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-main mb-2">No results found</h3>
              <p className="text-text-secondary">Try using different keywords or check your spelling</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={`${result.type}-${result.item.id}-${index}`}>
                {result.type === 'intelligence' 
                  ? renderIntelligenceResult(result.item as IntelligenceItem)
                  : renderModelResult(result.item as ModelItem)
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;