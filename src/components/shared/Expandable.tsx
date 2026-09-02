import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'info';
}

export default function Expandable({ title, children, defaultOpen = false, variant = 'default' }: ExpandableProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border rounded-md ${variant === 'info' ? 'border-info-blue bg-blue-50/30' : 'border-sage-200'} transition-all`}>
      <button
        className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors
          ${variant === 'info' ? 'text-info-blue hover:bg-blue-50/50' : 'text-charcoal-700 hover:bg-earth-50'}`}
        onClick={() => setOpen(!open)}
      >
        {variant === 'info' && <Info size={16} className="shrink-0" />}
        <span className="flex-1">{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-charcoal-700 leading-relaxed border-t border-sage-100 pt-3 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
