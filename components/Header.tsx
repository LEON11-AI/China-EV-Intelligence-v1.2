
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

const CompanyLogo: React.FC = () => (
    <div className="h-16 w-16 rounded-lg flex items-center justify-center overflow-hidden">
        <img 
            src="/images/logo.png" 
            alt="China EV Intelligence" 
            className="h-full w-full object-contain"
        />
    </div>
);

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
    setIsAuthDropdownOpen(false);
  };

  const handleSignIn = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
    setIsAuthDropdownOpen(false);
  };

  const toggleAuthDropdown = () => {
    setIsAuthDropdownOpen(!isAuthDropdownOpen);
  };

  return (
    <header className="bg-dark-card shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-6 group">
            <CompanyLogo />
            <span className="text-xl font-bold text-link-blue group-hover:text-link-hover transition-colors duration-300 ease-in-out">China EV Intelligence</span>
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-text-main hidden lg:block">
                    {user?.name || 'User'}
                  </span>
                  {user?.isPro && (
                    <span className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleAuthAction}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative ml-4" ref={authDropdownRef}>
                <button 
                  onClick={toggleAuthDropdown}
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out"
                >
                  <span>Account</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isAuthDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button 
                      onClick={handleSignIn}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={handleRegister}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
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
              
              {/* Mobile Auth Buttons */}
              <div className="px-3 py-2 space-y-2">
                {isAuthenticated ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-700 rounded-md">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-300">{user?.email}</p>
                      </div>
                      {user?.isPro && (
                        <span className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => { handleAuthAction(); closeMobileMenu(); }}
                      className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-gray-700 rounded-md p-2">
                      <p className="text-sm text-gray-300 mb-2 px-2">Account Options</p>
                      <button 
                        onClick={() => { handleSignIn(); closeMobileMenu(); }}
                        className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out mb-2"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => { handleRegister(); closeMobileMenu(); }}
                        className="w-full px-4 py-2 rounded-md text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 transition-all duration-300 ease-in-out"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
};

export default Header;
