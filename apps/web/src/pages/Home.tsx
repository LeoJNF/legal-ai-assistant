import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <h2>Seu Assistente Jurídico Inteligente</h2>
        <p>Análise de documentos, geração de petições e pesquisa jurídica com inteligência artificial</p>
      </div>

      <div className="services-grid">
        <ServiceCard
          icon="📄"
          title="Análise de Documentos"
          description="Analise contratos e documentos legais com IA. Identifique riscos, pontos-chave e recomendações."
          onClick={() => navigate('/document-analysis')}
        />
        <ServiceCard
          icon="⚖️"
          title="Geração de Petições"
          description="Gere petições e documentos jurídicos a partir de templates profissionais."
          onClick={() => navigate('/petition-generator')}
        />
        <ServiceCard
          icon="🔍"
          title="Pesquisa Jurídica"
          description="Pesquise jurisprudências e casos relevantes com busca inteligente."
          onClick={() => navigate('/legal-research')}
        />
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>💡 Sobre o Modo Demo</h3>
          <p>
            Esta aplicação está rodando em <strong>modo demonstração</strong> com dados fictícios.
            Todas as funcionalidades estão disponíveis para teste, mas nenhum dado real é processado.
          </p>
        </div>
      </div>
    </div>
  );
};
