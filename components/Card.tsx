
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-dark-200 rounded-xl shadow-lg p-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold text-dark-content mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
