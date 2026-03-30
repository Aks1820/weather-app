import React, { type ReactNode } from 'react';

interface WeatherCardProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  subtitle?: string;
  description?: string;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ title, icon, value, subtitle, description, className = '' }) => {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-5 hover:bg-slate-700/50 transition-colors ${className}`}>
      <div className="flex items-center space-x-2 text-slate-400 mb-3">
        {icon}
        <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-light text-slate-50">{value}</span>
          {subtitle && <span className="text-lg text-slate-400 font-medium">{subtitle}</span>}
        </div>
        {description && <p className="text-sm text-slate-400 mt-2 font-medium">{description}</p>}
      </div>
    </div>
  );
};

export default WeatherCard;
