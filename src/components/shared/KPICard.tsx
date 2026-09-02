import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  tooltip: string;
  icon?: React.ReactNode;
  accent?: 'green' | 'amber' | 'blue';
}

export default function KPICard({ label, value, tooltip, icon, accent = 'green' }: KPICardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const accentBorder = {
    green: 'border-l-forest-500',
    amber: 'border-l-amber-500',
    blue: 'border-l-info-blue',
  }[accent];

  return (
    <div className={`kpi-card border-l-3 ${accentBorder} relative animate-fade-in`}>
      <div className="flex items-start justify-between mb-1.5">
        <span className="text-xs font-medium text-charcoal-600 uppercase tracking-wider">{label}</span>
        <div className="relative">
          <button
            className="text-charcoal-500 hover:text-charcoal-700 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label={tooltip}
          >
            <HelpCircle size={14} />
          </button>
          {showTooltip && (
            <div className="absolute right-0 bottom-full mb-2 w-56 p-2.5 bg-charcoal-900 text-white text-xs rounded-md shadow-lg z-50 leading-relaxed">
              {tooltip}
              <div className="absolute top-full right-3 w-2 h-2 bg-charcoal-900 rotate-45 -mt-1" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {icon && <span className="text-forest-600">{icon}</span>}
        <span className="text-lg font-bold text-charcoal-900">{value}</span>
      </div>
    </div>
  );
}
