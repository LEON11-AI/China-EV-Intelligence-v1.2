import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-text-main mb-8 text-center">About China EV Intelligence</h1>

            <div className="grid md:grid-cols-3 gap-8 items-center bg-dark-card p-8 rounded-lg shadow-lg">
                <div className="md:col-span-1">
                    <img
                        src="https://picsum.photos/seed/ceo/400/400"
                        alt="Founder"
                        className="rounded-full mx-auto w-48 h-48 object-cover border-4 border-link-blue"
                    />
                </div>
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold text-link-blue mb-4">Jane Doe, Founder</h2>
                    <p className="text-text-secondary mb-4">
                        Based in Shanghai, I've had a front-row seat to the electric vehicle revolution. My passion for technology and transportation led me to create this platform. Traditional media often misses the nuance and speed of what's happening in the Chinese EV market. My goal is to bridge that gap.
                    </p>
                    <p className="text-text-secondary">
                        China EV Intelligence isn't just about data; it's about providing the critical context and expert insight that professionals, investors, and enthusiasts need to truly understand this dynamic industry. We're here to separate the signal from the noise.
                    </p>
                </div>
            </div>

            <div className="mt-16 text-center">
                <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                    To be the most trusted, insightful, and indispensable resource for intelligence on the Chinese electric vehicle market, empowering our subscribers with a decisive competitive edge.
                </p>
            </div>

            <div className="mt-16 text-center">
                <h2 className="text-4xl font-bold mb-12">Connect With Us</h2>
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                    <a href="https://www.youtube.com/@VoltChina" target="_blank" rel="noopener noreferrer" className="text-link-blue hover:text-link-hover transition-colors">YouTube</a>
                    <a href="https://x.com/xLeonStudio" target="_blank" rel="noopener noreferrer" className="text-link-blue hover:text-link-hover transition-colors">Twitter / X</a>
                    <a href="mailto:business@voltchina.net" className="text-link-blue hover:text-link-hover transition-colors">business@voltchina.net</a>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
