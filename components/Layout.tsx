
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-dark-card py-4 text-center text-text-secondary">
        <p>&copy; {new Date().getFullYear()} China EV Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
