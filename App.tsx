
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DatabasePage from './pages/DatabasePage';
import ModelDetailPage from './pages/ModelDetailPage';
import IntelligencePage from './pages/IntelligencePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import IntelligenceDetailPage from './pages/IntelligenceDetailPage';

const App: React.FC = () => {
  const [isPro, setIsPro] = useState<boolean>(false);

  return (
    <HashRouter>
      <Layout isPro={isPro} onTogglePro={() => setIsPro(!isPro)}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/model/:id" element={<ModelDetailPage isPro={isPro}/>} />
          <Route path="/intelligence" element={<IntelligencePage isPro={isPro}/>} />
          <Route path="/intelligence/:id" element={<IntelligenceDetailPage isPro={isPro}/>} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
