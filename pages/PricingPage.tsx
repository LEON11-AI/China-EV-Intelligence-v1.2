
import React from 'react';

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


const PricingPage: React.FC = () => {
    return (
        <div>
            <div className="text-center mb-16">
                 <h1 className="text-5xl font-bold text-text-main mb-4">Choose Your Plan</h1>
                 <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                    Get the level of intelligence you need, from casual enthusiast to industry professional.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="flex-1 bg-dark-card p-8 rounded-lg shadow-lg border-2 border-gray-700 flex flex-col transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    <h3 className="text-3xl font-bold text-center mb-2">Free</h3>
                    <p className="text-center text-text-secondary mb-6 h-12">Basic access for EV enthusiasts</p>
                    <p className="text-5xl font-bold text-center mb-6">$0<span className="text-xl text-text-secondary">/mo</span></p>
                    <ul className="space-y-4 text-text-secondary flex-grow mb-8">
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Limited access to model database</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Public intelligence updates</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Weekly newsletter</li>
                    </ul>
                     <button className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors duration-300 cursor-not-allowed">
                        Your Current Plan
                    </button>
                </div>
                {/* Pro Plan */}
                <div className="flex-1 bg-dark-card p-8 rounded-lg shadow-lg border-2 border-link-blue flex flex-col transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    <h3 className="text-3xl font-bold text-center mb-2">Pro</h3>
                    <p className="text-center text-text-secondary mb-6 h-12">The ultimate toolkit for industry professionals, analysts, and investors</p>
                    <p className="text-5xl font-bold text-center mb-6">$49<span className="text-xl text-text-secondary">/mo</span></p>
                     <ul className="space-y-4 text-text-secondary flex-grow mb-8">
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> <span className="font-bold text-text-main">Full access</span> to curated model database</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> <span className="font-bold text-text-main">Exclusive Pro</span> intelligence & analysis</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> <span className="font-bold text-text-main">In-depth CEO Notes</span> on all models</li>
                         <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Actionable insights with confidence ratings</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Priority support</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Export data options (coming soon)</li>
                    </ul>
                   <button className="w-full bg-cta-orange text-white font-bold py-3 px-6 rounded-md hover:bg-cta-hover transition-colors duration-300">
                        Subscribe to Pro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
