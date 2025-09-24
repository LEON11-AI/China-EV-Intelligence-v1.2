
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const CompanyLogo: React.FC = () => (
    <div className="h-16 w-16 rounded-lg flex items-center justify-center overflow-hidden">
        <img 
            src="/images/logo.png" 
            alt="China EV Intelligence" 
            className="h-full w-full object-contain"
        />
    </div>
);

interface HeaderProps {
  isPro: boolean;
  onTogglePro: () => void;
}

const Header: React.FC<HeaderProps> = ({ isPro, onTogglePro }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${
      isActive ? 'bg-link-blue text-white' : 'text-text-secondary hover:text-text-main hover:bg-dark-card'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out ${
      isActive ? 'bg-link-blue text-white' : 'text-text-secondary hover:text-text-main hover:bg-gray-700'
    }`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-dark-card shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-6 group">
            <CompanyLogo />
            <span className="text-xl font-bold text-link-blue group-hover:text-link-hover transition-colors duration-300 ease-in-out">China EV Intelligence Center</span>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search intelligence, brands, models..."
                className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-link-blue focus:border-transparent text-text-main placeholder-text-secondary"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-main hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-link-blue transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-bg border-t border-gray-700">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search intelligence, brands, models..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-dark-card border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-link-blue focus:border-transparent text-text-main placeholder-text-secondary"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>
              
              {/* Mobile Navigation Links */}
              <NavLink to="/intelligence" className={mobileNavLinkClass} onClick={closeMobileMenu}>Intelligence</NavLink>
              <NavLink to="/database" className={mobileNavLinkClass} onClick={closeMobileMenu}>Focused Database</NavLink>
              <NavLink to="/pricing" className={mobileNavLinkClass} onClick={closeMobileMenu}>Pricing</NavLink>
              <NavLink to="/about" className={mobileNavLinkClass} onClick={closeMobileMenu}>About</NavLink>
              
              {/* Mobile Login Button */}
              <div className="px-3 py-2">
                <button 
                  onClick={() => { onTogglePro(); closeMobileMenu(); }}
                  className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-cta-orange hover:bg-cta-hover transition-all duration-300 ease-in-out"
                >
                  {isPro ? 'Logout (Simulated)' : 'Login (Simulated)'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
