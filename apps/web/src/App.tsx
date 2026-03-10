import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { DocumentAnalysisPage } from './pages/DocumentAnalysis';
import { PetitionGeneratorPage } from './pages/PetitionGenerator';
import { LegalResearchPage } from './pages/LegalResearch';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/document-analysis" element={<DocumentAnalysisPage />} />
            <Route path="/petition-generator" element={<PetitionGeneratorPage />} />
            <Route path="/legal-research" element={<LegalResearchPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2026 Legal AI Assistant - Assistente Jurídico com Inteligência Artificial</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
