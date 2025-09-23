
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const CompanyLogo: React.FC = () => (
    <img 
        src="/images/logo.png" 
        alt="Company Logo" 
        className="h-16 w-16 object-contain"
    />
);

interface HeaderProps {
  isPro: boolean;
  onTogglePro: () => void;
}

const Header: React.FC<HeaderProps> = ({ isPro, onTogglePro }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${
      isActive ? 'bg-link-blue text-white' : 'text-text-secondary hover:text-text-main hover:bg-dark-card'
    }`;

  return (
    <header className="bg-dark-card shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-6 group">
            <CompanyLogo />
            <span className="text-xl font-bold text-link-blue group-hover:text-link-hover transition-colors duration-300 ease-in-out">China EV Intelligence Center</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/intelligence" className={navLinkClass}>Intelligence</NavLink>
            <NavLink to="/database" className={navLinkClass}>Focused Database</NavLink>
            <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <button 
              onClick={onTogglePro} 
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-cta-orange hover:bg-cta-hover transition-all duration-300 ease-in-out"
            >
              {isPro ? 'Logout (Simulated)' : 'Login (Simulated)'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
