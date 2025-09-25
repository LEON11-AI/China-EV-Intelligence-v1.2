
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider, useAuth } from './components/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DatabasePage from './pages/DatabasePage';
import ModelDetailPage from './pages/ModelDetailPage';
import IntelligencePage from './pages/IntelligencePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import IntelligenceDetailPage from './pages/IntelligenceDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CMSTest from './pages/CMSTest';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const isPro = user?.isPro || false;

  return (
    <BrowserRouter>
      <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/database" element={<DatabasePage />} />
              <Route path="/model/:id" element={<ModelDetailPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
              <Route path="/intelligence/:id" element={<IntelligenceDetailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/cms-test" element={<CMSTest />} />

              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Admin route - handled by vite middleware redirect */}
              <Route path="/admin/*" element={<div>Redirecting to admin...</div>} />
            </Routes>
      </Layout>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
