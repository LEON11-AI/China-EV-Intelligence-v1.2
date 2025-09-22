
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const CarLogoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-link-blue" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
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
          <Link to="/" className="flex items-center space-x-3 group">
            <CarLogoIcon />
            <span className="text-xl font-bold text-text-main group-hover:text-link-hover transition-colors duration-300 ease-in-out">China EV Intelligence</span>
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
