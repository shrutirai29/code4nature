interface ConfidenceIndicatorProps {
  level: number; // 1-5
  label?: string;
}

export default function ConfidenceIndicator({ level, label = 'Data confidence' }: ConfidenceIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-charcoal-600">{label}:</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors
              ${i <= level
                ? level >= 4 ? 'bg-forest-500' : level >= 3 ? 'bg-amber-500' : 'bg-red-400'
                : 'bg-sage-200'
              }`}
          />
        ))}
      </div>
      <span className="text-xs text-charcoal-600">
        {level >= 4 ? 'High' : level >= 3 ? 'Medium' : level >= 2 ? 'Low' : 'Very Low'}
      </span>
    </div>
  );
}
