import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 ${
        hover
          ? 'hover:shadow-md hover:border-emerald-300/80 transition-all duration-200 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
