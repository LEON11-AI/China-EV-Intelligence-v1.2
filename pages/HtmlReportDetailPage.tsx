import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contentService, HtmlReportItem } from '../src/services/ContentService';

const HtmlReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<HtmlReportItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setError('No report ID provided');
        setLoading(false);
        return;
      }

      try {
        const foundReport = await contentService.getHtmlReportById(id);
        if (foundReport) {
          setReport(foundReport);
          // Set document title to the report title
          document.title = foundReport.title;
        } else {
          setError('HTML report not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load HTML report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">Loading HTML report...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error Loading Report</div>
          <div className="text-gray-300 mb-6">{error}</div>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No report found
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">Report Not Found</div>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Extract the raw HTML content - handle both string and object formats
  const rawHtmlContent = typeof report.raw_html_content === 'string' 
    ? report.raw_html_content 
    : report.raw_html_content?.code || '';

  if (!rawHtmlContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">No HTML content available</div>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render the raw HTML content using iframe for complete isolation
  // This ensures all content including charts, scripts, and styles display correctly
  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}
    >
      {/* Use iframe to render HTML content with complete isolation */}
      <iframe
        srcDoc={rawHtmlContent}
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0
        }}
        title={`HTML Report: ${report.title}`}
      />
    </div>
  );
};

export default HtmlReportDetailPage;