
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService, IntelligenceItem } from '../src/services/ContentService';

interface IntelligencePageProps {
    isPro: boolean;
}

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cta-orange inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);


const IntelligencePage: React.FC<IntelligencePageProps> = ({ isPro }) => {
    const [items, setItems] = useState<IntelligenceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await contentService.getIntelligence();
                // Sort by date descending
                data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setItems(data);
            } catch (err: any)
{
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const getConfidenceClass = (confidence: string) => {
        switch (confidence) {
            case 'A': return 'bg-green-500';
            case 'B': return 'bg-yellow-500';
            case 'C': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    
    if (loading) return <div className="text-center">Loading intelligence feed...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">Intelligence Feed</h1>
            <p className="text-text-secondary mb-8">Real-time updates from the Chinese EV market, rated for confidence.</p>

            <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Title</th>
                                <th className="p-4 font-bold">Brand</th>
                                <th className="p-4 font-bold">Source</th>
                                <th className="p-4 font-bold text-center">Confidence</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {items.map(item => (
                                <tr key={item.id} className="hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="p-4 whitespace-nowrap font-mono text-text-secondary">{item.date}</td>
                                    <td className="p-4 max-w-md">
                                        <Link to={`/intelligence/${item.id}`} className="hover:text-link-blue transition-colors">
                                            {item.is_pro && !isPro ? (
                                                <div className="flex items-center">
                                                    <LockIcon/>
                                                    <span className="text-text-main">{item.title}</span>
                                                </div>
                                            ) : (
                                                <span className="text-text-main">{item.title} {item.is_pro && <span className="text-xs font-bold text-cta-orange ml-2">[PRO]</span>}</span>
                                            )}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-text-secondary">{item.brand}</td>
                                    <td className="p-4 text-text-secondary">{item.source}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${getConfidenceClass(item.confidence)}`}>
                                                {item.confidence}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {!isPro && (
                <div className="mt-8 text-center bg-dark-card p-6 rounded-lg shadow-lg">
                    <LockIcon />
                    <h3 className="text-xl font-bold">Unlock Pro Intelligence</h3>
                    <p className="text-text-secondary mt-2 mb-4">Subscribe to access exclusive, high-confidence intelligence items and in-depth analysis.</p>
                    <Link to="/pricing">
                        <button className="bg-cta-orange text-white font-bold py-2 px-6 rounded-md hover:bg-cta-hover transition-colors duration-300">
                            Upgrade Now
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default IntelligencePage;
