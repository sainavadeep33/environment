import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'slate' | 'mint' | 'forest';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    emerald: 'bg-emerald-100/80 text-emerald-800 border border-emerald-200',
    amber: 'bg-amber-100/90 text-amber-800 border border-amber-200',
    rose: 'bg-rose-100/80 text-rose-800 border border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    mint: 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-semibold',
    forest: 'bg-emerald-950 text-emerald-100 border border-emerald-800',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
