
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { contentService, IntelligenceItem } from '../src/services/ContentService';
import BrandLogos from '../components/BrandLogos';
import NewsletterSubscription from '../src/components/NewsletterSubscription';

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const HomePage: React.FC = () => {
    const [latestIntel, setLatestIntel] = useState<IntelligenceItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Set document title
        document.title = 'China EV Intelligence - Unrivaled Intelligence on China\'s EV Revolution';
        
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [intelData, categoriesData] = await Promise.all([
                    contentService.getLatestIntelligence(6),
                    contentService.getIntelligenceCategories()
                ]);
                setLatestIntel(intelData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCategoryFilter = async (category: string) => {
        setSelectedCategory(category);
        setIsLoading(true);
        
        try {
            let data;
            if (category === 'all') {
                data = await contentService.getLatestIntelligence(6);
            } else {
                data = await contentService.getFilteredIntelligence({
                    category,
                    limit: 6
                });
            }
            setLatestIntel(data);
        } catch (error) {
            console.error("Failed to filter intelligence:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-24">
            {/* Hero Section */}
            <section className="text-center py-20">
                <h1 className="text-5xl font-bold text-text-main mb-4">Unrivaled Intelligence on China's EV Revolution</h1>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
                    We bridge the information and context gap, delivering expert analysis and curated data on the world's fastest-moving auto market.
                </p>
                <Link to="/pricing">
                    <button className="bg-cta-orange text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-cta-hover shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                        Get Instant Access
                    </button>
                </Link>
            </section>
            
            {/* Newsletter Subscription Section */}
            <section className="max-w-4xl mx-auto">
                <NewsletterSubscription variant="hero" />
            </section>
            
            {/* Latest Intelligence Section */}
            <section>
                <h2 className="text-4xl font-bold text-center mb-8">Latest Intelligence</h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <button
                        onClick={() => handleCategoryFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedCategory === 'all'
                                ? 'bg-link-blue text-white'
                                : 'bg-dark-card text-text-secondary hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                                selectedCategory === category
                                    ? 'bg-link-blue text-white'
                                    : 'bg-dark-card text-text-secondary hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-blue"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {latestIntel.map(item => (
                        <div key={item.id} className="bg-dark-card p-6 rounded-lg shadow-lg flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
                           <div className="flex-grow">
                             <p className="text-sm text-text-secondary mb-2">{item.date} &middot; {item.brand}</p>
                             <h3 className="text-xl font-bold mb-4 text-text-main">{item.title}</h3>
                           </div>
                           <Link to={`/intelligence/${item.id}`} className="mt-4 text-link-blue font-semibold hover:text-link-hover self-start">
                                Read More &rarr;
                            </Link>
                        </div>
                    ))}
                    </div>
                )}
            </section>

            {/* Why Choose Us Section */}
            <section>
                <h2 className="text-4xl font-bold text-center mb-12">Why China EV Intelligence?</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-dark-card p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-link-blue">Deep-Dive Analysis</h3>
                        <p className="text-text-secondary">Go beyond headlines. Our "Chief Experience Officer" notes provide unparalleled context on strategy, technology, and market impact.</p>
                    </div>
                    <div className="bg-dark-card p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-link-blue">Curated Database</h3>
                        <p className="text-text-secondary">We focus on the most important models from key players, ensuring you get signal, not noise. All specs are verified and standardized.</p>
                    </div>
                    <div className="bg-dark-card p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-link-blue">VOLT Intelligence Feed</h3>
                        <p className="text-text-secondary">From exclusive industry insights to verified market intelligence, our curated feed delivers the context you need to stay ahead of China's EV revolution.</p>
                    </div>
                </div>
            </section>

            {/* Focused Brands Section */}
            <section>
                <h2 className="text-4xl font-bold text-center mb-12">Focused Brands</h2>
                <BrandLogos />
            </section>

            {/* Pricing Section */}
            <section id="pricing">
                 <h2 className="text-4xl font-bold text-center mb-12">Pricing Plans</h2>
                 <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="flex-1 bg-dark-card p-8 rounded-lg shadow-lg border-2 border-gray-700 flex flex-col transform hover:scale-105 transition-all duration-300 ease-in-out">
                        <h3 className="text-3xl font-bold text-center mb-2">Free</h3>
                        <p className="text-center text-text-secondary mb-6">Basic access for EV enthusiasts</p>
                        <p className="text-4xl font-bold text-center mb-6">$0<span className="text-lg text-text-secondary">/mo</span></p>
                        <ul className="space-y-4 text-text-secondary flex-grow">
                            <li className="flex items-start"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" /> Limited access to model database</li>
                            <li className="flex items-start"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" /> Public intelligence updates</li>
                            <li className="flex items-start"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" /> Weekly newsletter</li>
                        </ul>
                         <button className="mt-8 w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors duration-300">
                            Current Plan
                        </button>
                    </div>
                    {/* Pro Plan */}
                    <div className="flex-1 bg-dark-card p-8 rounded-lg shadow-lg border-2 border-link-blue flex flex-col transform hover:scale-105 transition-all duration-300 ease-in-out">
                        <h3 className="text-3xl font-bold text-center mb-2">Pro</h3>
                        <p className="text-center text-text-secondary mb-6">For industry professionals and investors</p>
                        <p className="text-4xl font-bold text-center mb-6">$49<span className="text-lg text-text-secondary">/mo</span></p>
                         <ul className="space-y-4 text-text-secondary flex-grow">
                            <li className="flex items-start"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" /> Full access to model database</li>
                            <li className="flex items-start"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" /> Exclusive Pro intelligence & analysis</li>
                            <li className="flex items-start"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" /> In-depth CEO Notes on all models</li>
                            <li className="flex items-start"><CheckIcon className="text-green-500 mr-2 flex-shrink-0" /> Export data options (coming soon)</li>
                        </ul>
                        <div className="mt-8 w-full">
                           <button className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-md cursor-not-allowed transition-colors duration-300" disabled>
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </>
    );
};

export default HomePage;
