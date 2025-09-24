
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentService, IntelligenceItem } from '../src/services/ContentService';
import AuthorSignature from '../components/AuthorSignature';

interface IntelligenceDetailPageProps {
    isPro: boolean;
}

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cta-orange inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);


const IntelligenceDetailPage: React.FC<IntelligenceDetailPageProps> = ({ isPro }) => {
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
                       <p>{item.content}</p>
                   )}
                </div>

                {showPaywall && (
                    <div className="mt-8 text-center bg-gray-900/50 p-6 rounded-lg">
                        <LockIcon />
                        <h3 className="text-xl font-bold">You're reading a Pro content preview.</h3>
                        <p className="text-text-secondary mt-2 mb-4">Subscribe to unlock the full analysis, plus our entire database of exclusive intelligence.</p>
                        <Link to="/pricing">
                            <button className="bg-cta-orange text-white font-bold py-2 px-6 rounded-md hover:bg-cta-hover transition-colors duration-300">
                                Subscribe to Unlock
                            </button>
                        </Link>
                    </div>
                )}
            </article>

            {/* Author Signature */}
            <AuthorSignature />
        </div>
    );
};

export default IntelligenceDetailPage;
