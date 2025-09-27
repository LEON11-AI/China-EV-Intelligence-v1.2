
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService, IntelligenceItem } from '../src/services/ContentService';
import { formatDateSmart } from '../src/services/DateUtils';
import { useAuth } from '../components/AuthContext';
import { AdvancedSearch } from '../components/AdvancedSearch';
import { SearchSuggestions } from '../components/SearchSuggestions';

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cta-orange inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);


const IntelligencePage: React.FC = () => {
    const { user } = useAuth();
    const isPro = user?.isPro || false;
    const [items, setItems] = useState<IntelligenceItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<IntelligenceItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await contentService.getIntelligence();
                // Sort by date descending
                data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setItems(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        let filtered = items;
        
        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }
        
        // Filter Supply Chain content for non-Pro users
        if (!isPro) {
            filtered = filtered.filter(item => item.category !== 'Supply Chain');
        }
        
        setFilteredItems(filtered);
    }, [items, selectedCategory, isPro]);

    const getAvailableCategories = () => {
        const categories = ['All', ...new Set(items.map(item => item.category))];
        // Remove Supply Chain from categories for non-Pro users
        if (!isPro) {
            return categories.filter(cat => cat !== 'Supply Chain');
        }
        return categories;
    };

    const getConfidenceGrade = (confidence: string) => {
        switch (confidence.toLowerCase()) {
            case 'high': return 'A';
            case 'medium': return 'B';
            case 'low': return 'C';
            default: return confidence; // fallback to original value
        }
    };

    const getConfidenceClass = (confidence: string) => {
        const grade = getConfidenceGrade(confidence);
        switch (grade) {
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Intelligence Feed</h1>
                    <p className="text-text-secondary">Real-time updates from the Chinese EV market, rated for confidence.</p>
                </div>
                <div className="text-right">
                    {isPro ? (
                        <div className="bg-green-600 text-white px-4 py-2 rounded-lg">
                            <span className="font-bold">Insider Reports + Early Access</span>
                        </div>
                    ) : (
                        <div className="bg-gray-600 text-white px-4 py-2 rounded-lg">
                            <span className="font-bold">Weekly Summaries</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {getAvailableCategories().map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                selectedCategory === category
                                    ? 'bg-cta-orange text-white'
                                    : 'bg-gray-700 text-text-secondary hover:bg-gray-600'
                            }`}
                        >
                            {category}
                            {category === 'Supply Chain' && isPro && (
                                <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">PRO</span>
                            )}
                        </button>
                    ))}
                </div>
                {selectedCategory === 'Supply Chain' && isPro && (
                    <p className="text-sm text-green-400 mt-2">
                        🔒 Exclusive supplier insights - Pro members only
                    </p>
                )}
            </div>

            <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Title</th>
                                <th className="p-4 font-bold">Category</th>
                                <th className="p-4 font-bold">Brand</th>
                                <th className="p-4 font-bold">Source</th>
                                <th className="p-4 font-bold text-center">Confidence</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="p-4 whitespace-nowrap font-mono text-text-secondary">{formatDateSmart(item.date)}</td>
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
                                    <td className="p-4 text-text-secondary">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            item.category === 'Supply Chain' ? 'bg-green-600 text-white' :
                                            item.category === 'Product Launch' ? 'bg-blue-600 text-white' :
                                            item.category === 'Market Expansion' ? 'bg-purple-600 text-white' :
                                            item.category === 'Safety Rating' ? 'bg-yellow-600 text-white' :
                                            item.category === 'Software Update' ? 'bg-indigo-600 text-white' :
                                            item.category === 'Market Analysis' ? 'bg-emerald-600 text-white' :
                                            item.category === 'market_analysis' ? 'bg-emerald-600 text-white' :
                                            item.category === 'technology' ? 'bg-cyan-600 text-white' :
                                            item.category === 'general' ? 'bg-slate-600 text-white' :
                                            'bg-gray-600 text-white'
                                        }`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-text-secondary">{item.brand}</td>
                                    <td className="p-4 text-text-secondary">{item.source}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${getConfidenceClass(item.confidence)}`}>
                                                {getConfidenceGrade(item.confidence)}
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
                    <h3 className="text-xl font-bold">Upgrade to Insider Reports</h3>
                    <p className="text-text-secondary mt-2 mb-4">Get exclusive insider reports with early access to high-confidence intelligence and in-depth market analysis.</p>
                    <Link to="/pricing">
                        <button className="bg-cta-orange text-white font-bold py-2 px-6 rounded-md hover:bg-cta-hover transition-colors duration-300">
                            Upgrade to Pro
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default IntelligencePage;
