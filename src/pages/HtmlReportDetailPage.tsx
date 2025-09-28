import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '../services/ContentService';
import { HtmlReportItem } from '../types/ContentTypes';

const HtmlReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<HtmlReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setError('Report ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const reportData = await contentService.getHtmlReportById(id);
        
        if (!reportData) {
          setError('Report not found');
        } else {
          setReport(reportData);
        }
      } catch (err) {
        console.error('Error fetching HTML report:', err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading report...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        color: '#dc3545'
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  // No report found
  if (!report) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Report not found</div>
      </div>
    );
  }

  // Get the raw HTML content - handle both string and object formats
  const rawHtmlContent = typeof report.raw_html_content === 'string' 
    ? report.raw_html_content 
    : report.raw_html_content?.code || '';

  // No HTML content available
  if (!rawHtmlContent) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>No HTML content available</div>
      </div>
    );
  }

  // Render raw HTML content with complete control - no wrapper styling
  return (
    <iframe
      srcDoc={rawHtmlContent}
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      title="HTML Report"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

export default HtmlReportDetailPage;