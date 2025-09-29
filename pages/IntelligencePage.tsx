
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentService, IntelligenceItem, HtmlReportItem } from '../src/services/ContentService';
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
    const [activeTab, setActiveTab] = useState<'articles' | 'reports'>('articles');
    const [items, setItems] = useState<IntelligenceItem[]>([]);
    const [htmlReports, setHtmlReports] = useState<HtmlReportItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<IntelligenceItem[]>([]);
    const [filteredReports, setFilteredReports] = useState<HtmlReportItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (forceRefresh = false) => {
        try {
            if (forceRefresh) {
                setRefreshing(true);
            }
            
            const [intelligenceData, htmlReportsData] = await Promise.all([
                forceRefresh ? contentService.forceRefreshIntelligence() : contentService.getIntelligence(),
                forceRefresh ? contentService.forceRefreshHtmlReports() : contentService.getHtmlReports()
            ]);
            
            console.log('Intelligence data loaded:', intelligenceData.length, 'articles');
            console.log('HTML reports data loaded:', htmlReportsData.length, 'reports');
            
            // Sort by date descending
            intelligenceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            htmlReportsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            setItems(intelligenceData);
            setHtmlReports(htmlReportsData);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchData(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Filter intelligence articles (exclude In-depth Analysis articles)
        let filteredIntelligence = items.filter(item => item.category !== 'In-depth Analysis');
        
        if (selectedCategory !== 'All') {
            filteredIntelligence = filteredIntelligence.filter(item => item.category === selectedCategory);
        }
        
        if (!isPro) {
            filteredIntelligence = filteredIntelligence.filter(item => item.category !== 'Supply Chain');
        }
        
        setFilteredItems(filteredIntelligence);
        
        // Filter HTML reports and include In-depth Analysis articles
        const depthAnalysisArticles = items.filter(item => item.category === 'In-depth Analysis');
        let filteredHtmlReports = [...htmlReports, ...depthAnalysisArticles];
        
        console.log('Filtering HTML reports:', htmlReports.length, 'total reports');
        console.log('Depth analysis articles:', depthAnalysisArticles.length);
        console.log('Selected category:', selectedCategory);
        
        if (selectedCategory !== 'All') {
            filteredHtmlReports = filteredHtmlReports.filter(item => {
                // Handle both report.category and item.category
                const category = item.category || (item as any).category;
                return category === selectedCategory;
            });
        }
        
        setFilteredReports(filteredHtmlReports);
    }, [items, htmlReports, selectedCategory, isPro]);

    // Reset category when switching tabs to avoid showing wrong categories
    useEffect(() => {
        setSelectedCategory('All');
    }, [activeTab]);

    const getAvailableCategories = () => {
        let categories: string[] = [];
        
        if (activeTab === 'articles') {
            // Only show categories from intelligence articles (exclude In-depth Analysis)
            const articleCategories = items.filter(item => item.category !== 'In-depth Analysis').map(item => item.category);
            categories = ['All', ...new Set(articleCategories)];
        } else {
            // Show categories from HTML reports and In-depth Analysis articles
            const reportCategories = htmlReports.map(report => report.category);
            const depthAnalysisCategories = items.filter(item => item.category === 'In-depth Analysis').map(item => item.category);
            categories = ['All', ...new Set([...reportCategories, ...depthAnalysisCategories])];
        }
        
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
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Intelligence Feed</h1>
                    </div>
                    <p className="text-text-secondary">Weekly Dynamics and In-depth Analysis of the Chinese EV Market, with Assessed Credibility</p>
                </div>

            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                            activeTab === 'articles'
                                ? 'bg-cta-orange text-white'
                                : 'text-text-secondary hover:text-white'
                        }`}
                    >
                        Intelligence Articles ({filteredItems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                            activeTab === 'reports'
                                ? 'bg-cta-orange text-white'
                                : 'text-text-secondary hover:text-white'
                        }`}
                    >
                        depth Analysis ({filteredReports.length})
                    </button>
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

            {/* Content based on active tab */}
            {activeTab === 'articles' ? (
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
                                                item.category === 'In-depth Analysis' ? 'bg-orange-600 text-white' :
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
            ) : (
                <div className="space-y-6">
                    {filteredReports.map(item => {
                        // Check if this is a depth analysis article (from intelligence) or HTML report
                        const isDepthAnalysis = item.category === 'In-depth Analysis';
                        const linkPath = isDepthAnalysis ? `/intelligence/${item.id}` : `/reports/${item.id}`;
                        
                        return (
                            <div key={item.id} className="bg-dark-card rounded-lg shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <Link 
                                                to={linkPath}
                                                className="text-xl font-bold text-text-main mb-2 hover:text-link-blue transition-colors duration-200 block"
                                            >
                                                {item.title}
                                            </Link>
                                            <div className="flex items-center space-x-4 text-sm text-text-secondary">
                                                <span className="font-mono">{formatDateSmart(item.date)}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    item.category === 'Market Analysis' ? 'bg-emerald-600 text-white' :
                                                    item.category === 'technology' ? 'bg-cyan-600 text-white' :
                                                    item.category === 'In-depth Analysis' ? 'bg-orange-600 text-white' :
                                                    'bg-gray-600 text-white'
                                                }`}>
                                                    {item.category}
                                                </span>
                                                {item.brand && <span>Brand: {item.brand}</span>}
                                                <span>Source: {item.source}</span>
                                                {isDepthAnalysis && item.confidence && (
                                                    <div className="flex items-center">
                                                        <span className="mr-1">Confidence:</span>
                                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs ${getConfidenceClass(item.confidence)}`}>
                                                            {getConfidenceGrade(item.confidence)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {item.summary && (
                                                <p className="text-text-secondary mt-2 text-sm">{item.summary}</p>
                                            )}
                                            <div className="mt-4">
                                                <Link 
                                                    to={linkPath}
                                                    className="inline-flex items-center px-4 py-2 bg-cta-orange hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {isDepthAnalysis ? 'Read Full Analysis' : 'View Full Report'}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
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
