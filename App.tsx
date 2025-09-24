
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DatabasePage from './pages/DatabasePage';
import ModelDetailPage from './pages/ModelDetailPage';
import IntelligencePage from './pages/IntelligencePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import IntelligenceDetailPage from './pages/IntelligenceDetailPage';
import SearchResultsPage from './src/pages/SearchResultsPage';

const App: React.FC = () => {
  const [isPro, setIsPro] = useState<boolean>(false);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout isPro={isPro} onTogglePro={() => setIsPro(!isPro)}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/model/:id" element={<ModelDetailPage isPro={isPro}/>} />
            <Route path="/intelligence" element={<IntelligencePage isPro={isPro}/>} />
            <Route path="/intelligence/:id" element={<IntelligenceDetailPage isPro={isPro}/>} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Admin route - handled by vite middleware redirect */}
            <Route path="/admin/*" element={<div>Redirecting to admin...</div>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
