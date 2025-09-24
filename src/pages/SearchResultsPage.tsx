import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { contentService, IntelligenceItem, ModelItem } from '../services/ContentService';

interface SearchResult {
  type: 'intelligence' | 'model';
  item: IntelligenceItem | ModelItem;
  score?: number;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
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

        // Configure Fuse.js search options
        const intelligenceOptions = {
          keys: [
            { name: 'title', weight: 0.4 },
            { name: 'summary', weight: 0.3 },
            { name: 'brand', weight: 0.2 },
            { name: 'tags', weight: 0.1 }
          ],
          threshold: 0.4,
          includeScore: true
        };

        const modelsOptions = {
          keys: [
            { name: 'model_name', weight: 0.4 },
            { name: 'brand', weight: 0.3 },
            { name: 'ceo_note', weight: 0.2 },
            { name: 'market_analysis.target_segment', weight: 0.1 }
          ],
          threshold: 0.4,
          includeScore: true
        };

        // Execute search
        const intelligenceFuse = new Fuse(intelligence, intelligenceOptions);
        const modelsFuse = new Fuse(models, modelsOptions);

        const intelligenceResults = intelligenceFuse.search(query);
        const modelsResults = modelsFuse.search(query);

        // Merge results
        const combinedResults: SearchResult[] = [
          ...intelligenceResults.map(result => ({
            type: 'intelligence' as const,
            item: result.item,
            score: result.score
          })),
          ...modelsResults.map(result => ({
            type: 'model' as const,
            item: result.item,
            score: result.score
          }))
        ];

        // Sort by relevance
        combinedResults.sort((a, b) => (a.score || 0) - (b.score || 0));

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

    performSearch();
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
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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