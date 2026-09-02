import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  message: string;
  variant?: 'warning' | 'info';
}

export default function Disclaimer({ message, variant = 'warning' }: DisclaimerProps) {
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-md text-xs leading-relaxed
      ${variant === 'warning'
        ? 'bg-amber-100/60 border border-amber-300/50 text-amber-800'
        : 'bg-info-blue-light/40 border border-info-blue/20 text-info-blue'
      }`}
    >
      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
