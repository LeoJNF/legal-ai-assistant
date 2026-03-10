import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import type { PetitionTemplate, GeneratedPetition } from '@/types/api';
import './PetitionGenerator.css';

export const PetitionGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PetitionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [petition, setPetition] = useState<GeneratedPetition | null>(null);
  const [formData, setFormData] = useState({
    author: '',
    defendant: '',
    value: '',
    description: ''
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await api.getPetitionTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      alert('Selecione um template');
      return;
    }

    setLoading(true);
    try {
      const result = await api.generatePetition(selectedTemplate, formData);
      setPetition(result);
    } catch (error) {
      console.error('Erro ao gerar petição:', error);
      alert('Erro ao gerar petição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Voltar
      </button>

      <div className="page-header">
        <h2>⚖️ Geração de Petições</h2>
        <p>Gere petições profissionais a partir de templates</p>
      </div>

      {!petition ? (
        <div className="generator-form">
          <div className="form-section">
            <label htmlFor="template">Selecione o Template:</label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="select-input"
            >
              <option value="">-- Selecione um template --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title} ({template.category})
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <p className="template-description">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
            )}
          </div>

          {selectedTemplate && (
            <>
              <div className="form-section">
                <label htmlFor="author">Nome do Autor:</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className="form-section">
                <label htmlFor="defendant">Nome do Réu:</label>
                <input
                  type="text"
                  id="defendant"
                  name="defendant"
                  value={formData.defendant}
                  onChange={handleInputChange}
                  placeholder="Ex: Empresa XYZ Ltda"
                />
              </div>

              <div className="form-section">
                <label htmlFor="value">Valor da Causa (R$):</label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="Ex: 10.000,00"
                />
              </div>

              <div className="form-section">
                <label htmlFor="description">Descrição dos Fatos:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva resumidamente os fatos relevantes..."
                  rows={6}
                />
              </div>

              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? '⏳ Gerando...' : '📝 Gerar Petição'}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="petition-result">
          <div className="result-header">
            <h3>{petition.title}</h3>
            <div className="result-actions">
              <button onClick={() => setPetition(null)} className="new-petition-button">
                ✏️ Nova Petição
              </button>
            </div>
          </div>

          <div className="petition-content">
            <pre>{petition.content}</pre>
          </div>

          <div className="result-footer">
            <small>Gerado em: {new Date(petition.createdAt).toLocaleString('pt-BR')}</small>
          </div>
        </div>
      )}
    </div>
  );
};
