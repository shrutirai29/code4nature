import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Language } from '../types';
import { t } from '../data/translations';

interface LangContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  return (
    <LangContext.Provider value={{ lang, setLang, t: (key: string) => t(key, lang) }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
