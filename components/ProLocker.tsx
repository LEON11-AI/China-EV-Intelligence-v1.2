
import React from 'react';
import { Link } from 'react-router-dom';

interface ProLockerProps {
    isPro: boolean;
    children: React.ReactNode;
    title?: string;
    description?: string;
    upgradeText?: string;
}

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

const ProLocker: React.FC<ProLockerProps> = ({ 
    isPro, 
    children, 
    title = "Pro Content",
    description = "This section is available for Pro members.",
    upgradeText = "Unlock with Pro"
}) => {
    if (isPro) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            <div className="blur-md select-none pointer-events-none">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-card/80 rounded-lg p-4">
                <LockIcon />
                <p className="text-white font-bold text-lg mt-2 text-center">{title}</p>
                <p className="text-text-secondary text-sm text-center mb-4">{description}</p>
                <button 
                    disabled 
                    className="bg-gray-600 text-gray-400 font-bold py-2 px-5 rounded-md cursor-not-allowed transition-colors duration-300"
                >
                    Coming Soon
                </button>
            </div>
        </div>
    );
};

export default ProLocker;
