
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { contentService, IntelligenceItem } from '../src/services/ContentService';
import { formatDateSmart } from '../src/services/DateUtils';
import { useAuth } from '../components/AuthContext';
import AuthorSignature from '../components/AuthorSignature';
import NewsletterSubscription from '../src/components/NewsletterSubscription';
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon
} from 'react-share';

// Raw HTML Content Renderer Component
interface RawHTMLContentRendererProps {
  htmlContent: string;
  title: string;
}

const RawHTMLContentRenderer: React.FC<RawHTMLContentRendererProps> = ({ htmlContent, title }) => {
  const [processedContent, setProcessedContent] = useState<string>('');
  
  useEffect(() => {
    // Process HTML content to ensure proper rendering
    let processed = htmlContent;
    
    // Ensure scripts are executable
    processed = processed.replace(/<script([^>]*)>/gi, '<script$1>');
    
    // Ensure styles are applied
    processed = processed.replace(/<style([^>]*)>/gi, '<style$1>');
    
    setProcessedContent(processed);
  }, [htmlContent]);
  
  return (
    <div className="w-full relative">
      <style>{`
        .raw-html-content {
          /* Minimal reset to preserve HTML content styling */
          display: block;
          width: 100%;
          line-height: 1.6;
          color: inherit;
          /* Isolate styles to prevent conflicts */
          all: initial;
          font-family: inherit;
          background: transparent;
        }
        .raw-html-content * {
          /* Reset box model for all child elements */
          box-sizing: border-box;
        }
        .raw-html-content h1,
        .raw-html-content h2,
        .raw-html-content h3,
        .raw-html-content h4,
        .raw-html-content h5,
        .raw-html-content h6 {
          margin: 1em 0 0.5em 0;
          font-weight: bold;
          line-height: 1.2;
        }
        .raw-html-content p {
          margin: 0.5em 0;
          line-height: 1.6;
        }
        .raw-html-content img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        .raw-html-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        .raw-html-content th,
        .raw-html-content td {
          padding: 0.5em;
          border: 1px solid #ccc;
          text-align: left;
        }
        /* Preserve chart and visualization styles */
        .raw-html-content canvas,
        .raw-html-content svg {
          max-width: 100%;
          height: auto;
          display: block;
        }
        /* Ensure interactive elements work properly */
        .raw-html-content button,
        .raw-html-content input,
        .raw-html-content select {
          font-family: inherit;
          font-size: inherit;
        }
        /* Preserve custom styles and animations */
        .raw-html-content .chart-container,
        .raw-html-content .progress-bar,
        .raw-html-content .interactive-element {
          /* Allow custom styles to take precedence */
          all: revert;
        }
      `}</style>
      <div 
        className="raw-html-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
        style={{
          minHeight: '400px',
          maxWidth: '100%',
          overflow: 'auto',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

// HTML Content Renderer Component
interface HTMLContentRendererProps {
  htmlFile: string;
  title: string;
}

const HTMLContentRenderer: React.FC<HTMLContentRendererProps> = ({ htmlFile, title }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeHeight, setIframeHeight] = useState<number>(800);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    setLoading(false);
    
    // Auto-resize iframe based on content
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        const resizeIframe = () => {
          try {
            const contentHeight = iframe.contentWindow?.document.body.scrollHeight;
            if (contentHeight && contentHeight > 400) {
              setIframeHeight(Math.min(contentHeight + 50, 2000)); // Max height 2000px
            }
          } catch (e) {
            // Cross-origin restrictions, keep default height
            console.log('Cannot access iframe content for auto-resize');
          }
        };
        
        // Initial resize
        setTimeout(resizeIframe, 100);
        
        // Listen for content changes
        iframe.contentWindow.addEventListener('resize', resizeIframe);
      }
    } catch (e) {
      console.log('Auto-resize not available for cross-origin content');
    }
  };

  const handleIframeError = () => {
    setError('Failed to load HTML content');
    setLoading(false);
  };

  useEffect(() => {
    // Reset loading state when htmlFile changes
    setLoading(true);
    setError(null);
    setIframeKey(prev => prev + 1);
    setIframeHeight(800); // Reset height
  }, [htmlFile]);

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
        <div className="text-red-400 mb-2">Failed to load HTML content</div>
        <div className="text-sm text-red-300">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            setIframeKey(prev => prev + 1);
          }}
          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {loading && (
        <div className="flex justify-center items-center py-12 absolute inset-0 bg-gray-900/50 z-10 rounded-lg">
          <div className="text-text-secondary flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span>Loading HTML content...</span>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        key={iframeKey}
        src={htmlFile}
        title={title}
        className="w-full border-0 rounded-lg"
        style={{
          height: `${iframeHeight}px`,
          maxWidth: '100%',
          background: 'white',
          transition: 'height 0.3s ease'
        }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation allow-downloads allow-presentation"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
};

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cta-orange inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);


const IntelligenceDetailPage: React.FC = () => {
    const { user } = useAuth();
    const isPro = user?.isPro || false;
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<IntelligenceItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            try {
                const foundItem = await contentService.getIntelligenceById(id);
                if (foundItem) {
                    setItem(foundItem);
                    // Set document title
                    document.title = `${foundItem.title} - China EV Intelligence`;
                } else {
                    setError('Intelligence item not found');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <div className="text-center">Loading intelligence...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;
    if (!item) return <div className="text-center">No intelligence data available.</div>;

    const contentTeaser = item.content.split('. ').slice(0, 2).join('. ') + '.';
    const showPaywall = item.is_pro && !isPro;

    return (
        <>
            <div className="max-w-4xl mx-auto">
            <Link to="/intelligence" className="text-link-blue hover:text-link-hover mb-4 inline-block">&larr; Back to Intelligence Feed</Link>
            
            <article className="bg-dark-card p-8 rounded-lg shadow-lg">
                <header className="border-b border-gray-700 pb-4 mb-6">
                    <h1 className="text-4xl font-bold text-text-main">{item.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary mt-2">
                        <span>{formatDateSmart(item.date)}</span>
                        <span>&middot;</span>
                        <span>Brand: {item.brand}</span>
                        <span>&middot;</span>
                        <span>Source: {item.source}</span>
                         {item.is_pro && <span className="text-xs font-bold text-cta-orange">[PRO]</span>}
                    </div>
                </header>

                <div className="max-w-none text-text-secondary text-lg leading-relaxed">
                   {showPaywall ? (
                       <div className="prose prose-invert max-w-none">
                           <p>{contentTeaser}</p>
                       </div>
                   ) : (
                       item.raw_html_content ? (
                           <RawHTMLContentRenderer htmlContent={item.raw_html_content} title={item.title} />
                       ) : (item.content_type === 'html_file' || item.html_file || item.content.startsWith('html:')) ? (
                           <HTMLContentRenderer 
                               htmlFile={item.content_type === 'html_file' ? item.content : (item.html_file || item.content.replace('html:', ''))} 
                               title={item.title} 
                           />
                       ) : (
                           <div className="prose prose-invert max-w-none">
                               <ReactMarkdown
                                   components={{
                                       img: ({ src, alt, ...props }) => (
                                           <img 
                                               src={src} 
                                               alt={alt} 
                                               {...props}
                                               className="max-w-full h-auto rounded-lg shadow-md my-4"
                                               style={{ maxWidth: '100%', height: 'auto' }}
                                           />
                                       ),
                                       p: ({ children, ...props }) => (
                                           <p className="mb-4 text-text-secondary leading-relaxed" {...props}>
                                               {children}
                                           </p>
                                       ),
                                       h1: ({ children, ...props }) => (
                                           <h1 className="text-3xl font-bold text-text-main mt-8 mb-4" {...props}>
                                               {children}
                                           </h1>
                                       ),
                                       h2: ({ children, ...props }) => (
                                           <h2 className="text-2xl font-bold text-text-main mt-6 mb-3" {...props}>
                                               {children}
                                           </h2>
                                       ),
                                       h3: ({ children, ...props }) => (
                                           <h3 className="text-xl font-bold text-text-main mt-4 mb-2" {...props}>
                                               {children}
                                           </h3>
                                       ),
                                       ul: ({ children, ...props }) => (
                                           <ul className="list-disc list-inside mb-4 text-text-secondary" {...props}>
                                               {children}
                                           </ul>
                                       ),
                                       ol: ({ children, ...props }) => (
                                           <ol className="list-decimal list-inside mb-4 text-text-secondary" {...props}>
                                               {children}
                                           </ol>
                                       ),
                                       blockquote: ({ children, ...props }) => (
                                           <blockquote className="border-l-4 border-blue-500 pl-4 italic text-text-secondary bg-gray-800/50 py-2 my-4 rounded-r" {...props}>
                                               {children}
                                           </blockquote>
                                       ),
                                       code: ({ children, ...props }) => (
                                           <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm" {...props}>
                                               {children}
                                           </code>
                                       ),
                                       pre: ({ children, ...props }) => (
                                           <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto my-4" {...props}>
                                               {children}
                                           </pre>
                                       )
                                   }}
                               >
                                   {item.content}
                               </ReactMarkdown>
                           </div>
                       )
                   )}
                </div>

                {showPaywall && (
                    <div className="mt-8 text-center bg-gray-900/50 p-6 rounded-lg">
                        <LockIcon />
                        <h3 className="text-xl font-bold">You're reading a Pro content preview.</h3>
                        <p className="text-text-secondary mt-2 mb-4">Subscribe to unlock the full analysis, plus our entire database of exclusive intelligence.</p>
                        <button 
                            disabled 
                            className="bg-gray-600 text-gray-400 font-bold py-2 px-6 rounded-md cursor-not-allowed transition-colors duration-300"
                        >
                            Coming Soon
                        </button>
                    </div>
                )}
            </article>

            {/* Social Share Buttons */}
            <div className="mt-6 mb-6">
                <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-text-main mb-4">Share This Article</h3>
                    <div className="flex space-x-4">
                        <TwitterShareButton
                            url={window.location.href}
                            title={item.title}
                            hashtags={item.tags}
                            className="hover:opacity-80 transition-opacity"
                        >
                            <TwitterIcon size={40} round />
                        </TwitterShareButton>
                        
                        <LinkedinShareButton
                            url={window.location.href}
                            title={item.title}
                            summary={item.summary}
                            source="China EV Intelligence"
                            className="hover:opacity-80 transition-opacity"
                        >
                            <LinkedinIcon size={40} round />
                        </LinkedinShareButton>
                        
                        <FacebookShareButton
                            url={window.location.href}
                            quote={item.title}
                            hashtag={`#${item.brand}`}
                            className="hover:opacity-80 transition-opacity"
                        >
                            <FacebookIcon size={40} round />
                        </FacebookShareButton>
                    </div>
                    <p className="text-sm text-text-secondary mt-3">
                        Help more people stay informed about China's EV industry developments
                    </p>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-6 mb-6">
                <NewsletterSubscription variant="sidebar" />
            </div>

            {/* Author Signature */}
            <AuthorSignature />
            </div>
        </>
    );
};

export default IntelligenceDetailPage;
