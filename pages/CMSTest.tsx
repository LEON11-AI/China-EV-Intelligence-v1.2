import React, { useState, useEffect } from 'react';
import ContentService from '../src/services/ContentService';
import type { IntelligenceItem, ModelItem } from '../src/services/ContentService';
import { formatDateSmart } from '../src/services/DateUtils';

const CMSTest: React.FC = () => {
  const [intelligence, setIntelligence] = useState<IntelligenceItem[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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