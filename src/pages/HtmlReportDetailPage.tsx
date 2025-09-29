import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '../services/ContentService';
import { HtmlReportItem } from '../types/ContentTypes';

const HtmlReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<HtmlReportItem | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
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
          setLoading(false);
          return;
        }

        setReport(reportData);

        // Load HTML content from file path or use direct content
        let htmlContent = '';
        if (typeof reportData.raw_html_content === 'string') {
          // Check if it's a file path (starts with / or contains .html)
          if (reportData.raw_html_content.startsWith('/') || reportData.raw_html_content.includes('.html')) {
            // It's a file path, fetch the content
            try {
              const response = await fetch(reportData.raw_html_content);
              if (response.ok) {
                htmlContent = await response.text();
              } else {
                throw new Error(`Failed to load HTML file: ${response.status}`);
              }
            } catch (fetchError) {
              console.error('Error fetching HTML file:', fetchError);
              setError('Failed to load HTML content');
              setLoading(false);
              return;
            }
          } else {
            // It's direct HTML content
            htmlContent = reportData.raw_html_content;
          }
        } else if (reportData.raw_html_content?.code) {
          // Handle object format with code property
          htmlContent = reportData.raw_html_content.code;
        }

        setHtmlContent(htmlContent);
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

  // No HTML content available
  if (!htmlContent) {
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
      srcDoc={htmlContent}
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