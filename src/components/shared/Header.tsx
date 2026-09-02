import { Leaf, Globe } from 'lucide-react';
import { useLang } from '../../contexts/LangContext';
import { useApp } from '../../contexts/AppContext';
import type { Language } from '../../types';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'gu', label: 'ગુ' },
];

export default function Header() {
  const { lang, setLang } = useLang();
  const { panchayat } = useApp();

  return (
    <header className="h-14 bg-white border-b border-sage-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <div className="flex items-center gap-2">
          <Leaf size={18} className="text-forest-700" />
          <span className="font-bold text-forest-800 text-sm tracking-wide">VASUDHA CO2</span>
        </div>
        {panchayat && (
          <span className="hidden md:inline text-sm text-charcoal-600 border-l border-sage-200 pl-3 ml-1">
            {panchayat.name}, {panchayat.block}, {panchayat.district}, {panchayat.state}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-charcoal-600 hidden sm:inline">Demo data</span>
        <div className="flex items-center border border-sage-200 rounded-md overflow-hidden">
          <Globe size={14} className="text-charcoal-600 ml-2" />
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2 py-1.5 text-xs font-medium transition-colors
                ${lang === l.code
                  ? 'bg-forest-700 text-white'
                  : 'text-charcoal-700 hover:bg-earth-50'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
