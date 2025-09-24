
import React from 'react';

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

            <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="flex-1 bg-dark-card p-6 sm:p-8 rounded-lg shadow-lg border-2 border-gray-700 flex flex-col transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out touch-manipulation">
                    <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2">Free</h3>
                    <p className="text-center text-text-secondary mb-4 sm:mb-6 min-h-[3rem] sm:h-12">Basic access for EV enthusiasts</p>
                    <p className="text-4xl sm:text-5xl font-bold text-center mb-4 sm:mb-6">$0<span className="text-lg sm:text-xl text-text-secondary">/mo</span></p>
                    <ul className="space-y-4 text-text-secondary flex-grow mb-8">
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Limited access to model database</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Public intelligence updates</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Weekly newsletter</li>
                    </ul>
                     <button className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors duration-300 cursor-not-allowed touch-manipulation">
                        Your Current Plan
                    </button>
                </div>
                {/* Pro Plan */}
                <div className="flex-1 bg-dark-card p-6 sm:p-8 rounded-lg shadow-lg border-2 border-link-blue flex flex-col transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out touch-manipulation">
                    <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2">Pro</h3>
                    <p className="text-center text-text-secondary mb-4 sm:mb-6 min-h-[3rem] sm:h-12">The ultimate toolkit for industry professionals, analysts, and investors</p>
                    <p className="text-4xl sm:text-5xl font-bold text-center mb-4 sm:mb-6">$49<span className="text-lg sm:text-xl text-text-secondary">/mo</span></p>
                     <ul className="space-y-4 text-text-secondary flex-grow mb-8">
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> <span className="font-bold text-text-main">Full access</span> to curated model database</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> <span className="font-bold text-text-main">Exclusive Pro</span> intelligence & analysis</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> <span className="font-bold text-text-main">In-depth CEO Notes</span> on all models</li>
                         <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Actionable insights with confidence ratings</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Priority support</li>
                        <li className="flex items-start"><CheckIcon className="text-green-500 mr-3 flex-shrink-0" /> Export data options (coming soon)</li>
                    </ul>
                   <button className="w-full bg-cta-orange text-white font-bold py-3 px-6 rounded-md hover:bg-cta-hover transition-all duration-300 touch-manipulation active:scale-95">
                        Subscribe to Pro
                    </button>
                </div>
            </div>

            {/* Feature Comparison Section */}
            <div className="mt-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-text-main mb-4">Detailed Feature Comparison</h2>
                    <p className="text-xl text-text-secondary">Understand the specific differences between Free and Pro versions</p>
                </div>

                <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-lg font-semibold text-text-main">Feature</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-sm sm:text-lg font-semibold text-text-main">Free</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-sm sm:text-lg font-semibold text-text-main border-l-2 border-link-blue">Pro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-text-main text-sm sm:text-base">Model Database Access</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-text-secondary text-xs sm:text-sm">Basic model info</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-400">Limited vehicle data</span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-green-400 text-xs sm:text-sm">Complete database + analysis</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-300">All models detailed data</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-text-main text-sm sm:text-base">Intelligence Updates</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-text-secondary text-xs sm:text-sm">Public news</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-400">Basic industry updates</span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-green-400 text-xs sm:text-sm">Exclusive professional analysis</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-300">Deep market insights</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-6 py-4 font-medium text-text-main">CEO Deep Notes</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <CrossIcon className="text-red-500 mr-2" />
                                            <span className="text-red-400">Not available</span>
                                        </div>
                                        <span className="text-sm text-gray-400">No access</span>
                                    </td>
                                    <td className="px-6 py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-2" />
                                            <span className="text-green-400">All models deep notes</span>
                                        </div>
                                        <span className="text-sm text-gray-300">Professional insights</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-text-main text-sm sm:text-base">Data Export</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CrossIcon className="text-red-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-red-400 text-xs sm:text-sm">Not supported</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-400">No export function</span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-green-400 text-xs sm:text-sm">Multiple format export</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-300">Excel, PDF, CSV</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-text-main text-sm sm:text-base">Customer Support</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-text-secondary text-xs sm:text-sm">Community support</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-400">Forum and FAQ</span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-0 sm:mr-2 mb-1 sm:mb-0 h-4 w-4 sm:h-6 sm:w-6" />
                                            <span className="text-green-400 text-xs sm:text-sm">Priority technical support</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-300">Dedicated support team</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-6 py-4 font-medium text-text-main">Update Frequency</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-2" />
                                            <span className="text-text-secondary">Weekly updates</span>
                                        </div>
                                        <span className="text-sm text-gray-400">Regular content push</span>
                                    </td>
                                    <td className="px-6 py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-2" />
                                            <span className="text-green-400">Real-time updates</span>
                                        </div>
                                        <span className="text-sm text-gray-300">Instant market dynamics</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-6 py-4 font-medium text-text-main">Confidence Ratings</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <CrossIcon className="text-red-500 mr-2" />
                                            <span className="text-red-400">Not available</span>
                                        </div>
                                        <span className="text-sm text-gray-400">No rating system</span>
                                    </td>
                                    <td className="px-6 py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-2" />
                                            <span className="text-green-400">Professional confidence ratings</span>
                                        </div>
                                        <span className="text-sm text-gray-300">Data reliability indicators</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-800 transition-colors duration-300">
                                    <td className="px-6 py-4 font-medium text-text-main">API Access</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <CrossIcon className="text-red-500 mr-2" />
                                            <span className="text-red-400">Not supported</span>
                                        </div>
                                        <span className="text-sm text-gray-400">No API permissions</span>
                                    </td>
                                    <td className="px-6 py-4 text-center border-l-2 border-link-blue">
                                        <div className="flex items-center justify-center mb-2">
                                            <CheckIcon className="text-green-500 mr-2" />
                                            <span className="text-green-400">Full API access</span>
                                        </div>
                                        <span className="text-sm text-gray-300">Integration development support</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 sm:mt-16 text-center">
                    <div className="bg-gradient-to-r from-link-blue to-cta-orange p-6 sm:p-8 rounded-lg">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Ready to upgrade?</h3>
                        <p className="text-base sm:text-lg text-gray-200 mb-4 sm:mb-6 px-2">Join thousands of professionals who rely on our intelligence for strategic decisions.</p>
                        <button className="bg-white text-link-blue font-bold py-3 px-6 sm:px-8 rounded-md hover:bg-gray-100 transition-all duration-300 touch-manipulation active:scale-95 text-sm sm:text-base">
                            Upgrade to Pro Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
