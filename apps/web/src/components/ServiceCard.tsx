import React from 'react';
import './ServiceCard.css';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div className="service-card" onClick={onClick}>
      <div className="service-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="service-button">Acessar Serviço →</button>
    </div>
  );
};
