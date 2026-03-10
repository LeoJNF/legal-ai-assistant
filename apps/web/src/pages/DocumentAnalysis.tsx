import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import type { DocumentAnalysis } from '@/types/api';
import './DocumentAnalysis.css';

export const DocumentAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const result = await api.analyzeDocument(file);
      setAnalysis(result);
    } catch (error) {
      console.error('Erro ao analisar documento:', error);
      alert('Erro ao analisar documento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Voltar
      </button>

      <div className="page-header">
        <h2>📄 Análise de Documentos</h2>
        <p>Faça upload de um documento legal para análise com IA</p>
      </div>

      <div className="upload-section">
        <div className="file-input-container">
          <input
            type="file"
            id="file-input"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `📎 ${file.name}` : '📁 Selecionar Arquivo (PDF, DOC, DOCX)'}
          </label>
        </div>

        {file && (
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? '⏳ Analisando...' : '🔍 Analisar Documento'}
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Analisando documento... Isso pode levar alguns segundos.</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="analysis-results">
          <div className="result-section">
            <h3>📋 Resumo</h3>
            <p>{analysis.summary}</p>
          </div>

          <div className="result-section">
            <h3>🔑 Pontos-Chave</h3>
            <ul>
              {analysis.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="result-section risks">
            <h3>⚠️ Riscos Identificados</h3>
            <ul>
              {analysis.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>

          <div className="result-section recommendations">
            <h3>💡 Recomendações</h3>
            <ul>
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="result-footer">
            <small>Análise realizada em: {new Date(analysis.analyzedAt).toLocaleString('pt-BR')}</small>
          </div>
        </div>
      )}
    </div>
  );
};
