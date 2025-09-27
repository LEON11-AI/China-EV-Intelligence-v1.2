
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { contentService, IntelligenceItem } from '../src/services/ContentService';
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
                        <span>{item.date}</span>
                        <span>&middot;</span>
                        <span>Brand: {item.brand}</span>
                        <span>&middot;</span>
                        <span>Source: {item.source}</span>
                         {item.is_pro && <span className="text-xs font-bold text-cta-orange">[PRO]</span>}
                    </div>
                </header>

                <div className="prose prose-invert max-w-none text-text-secondary text-lg leading-relaxed">
                   {showPaywall ? (
                       <p>{contentTeaser}</p>
                   ) : (
                       item.content.startsWith('html:') ? (
                           <div className="w-full">
                               <iframe 
                                   src={item.content.replace('html:', '')} 
                                   className="w-full h-screen border-0 rounded-lg"
                                   title={item.title}
                                   style={{ minHeight: '800px' }}
                               />
                           </div>
                       ) : (
                           <p>{item.content}</p>
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
