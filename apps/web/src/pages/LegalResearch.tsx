import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import type { LegalResearch } from '@/types/api';
import './LegalResearch.css';

export const LegalResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<LegalResearch | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Digite um termo de pesquisa');
      return;
    }

    setLoading(true);
    try {
      const result = await api.searchLegalCases(query);
      setResearch(result);
    } catch (error) {
      console.error('Erro ao pesquisar:', error);
      alert('Erro ao realizar pesquisa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Voltar
      </button>

      <div className="page-header">
        <h2>🔍 Pesquisa Jurídica</h2>
        <p>Pesquise jurisprudências e casos relevantes</p>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pesquisa (ex: danos morais, direito trabalhista...)"
            className="search-input"
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? '⏳' : '🔍'} Pesquisar
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Pesquisando jurisprudências... Aguarde.</p>
        </div>
      )}

      {research && !loading && (
        <div className="research-results">
          <div className="results-header">
            <h3>Resultados da pesquisa: "{research.query}"</h3>
            <p>{research.results.length} casos encontrados</p>
          </div>

          <div className="cases-list">
            {research.results.map((legalCase) => (
              <div key={legalCase.id} className="case-card">
                <div className="case-header">
                  <h4>{legalCase.title}</h4>
                  <div className="relevance-badge">
                    {legalCase.relevance}% relevante
                  </div>
                </div>
                <div className="case-meta">
                  <span className="case-court">🏛️ {legalCase.court}</span>
                  <span className="case-date">📅 {new Date(legalCase.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="case-summary">{legalCase.summary}</p>
              </div>
            ))}
          </div>

          <div className="result-footer">
            <small>Pesquisa realizada em: {new Date(research.analyzedAt).toLocaleString('pt-BR')}</small>
          </div>
        </div>
      )}

      {!research && !loading && (
        <div className="empty-state">
          <p>💡 Digite um termo para pesquisar jurisprudências e casos relevantes</p>
          <div className="suggestions">
            <h4>Exemplos de pesquisa:</h4>
            <ul>
              <li>danos morais em relação de consumo</li>
              <li>rescisão indireta de contrato de trabalho</li>
              <li>usucapião extraordinária</li>
              <li>guarda compartilhada de filhos</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
