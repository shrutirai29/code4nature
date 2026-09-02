import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PanchayatData, ViabilityInputs, NeighbouringPanchayat } from '../types';
import { demoPanchayat, defaultViabilityInputs } from '../data/demo';

interface AppState {
  panchayat: PanchayatData | null;
  viabilityInputs: ViabilityInputs;
  selectedNeighbours: NeighbouringPanchayat[];
  sidebarOpen: boolean;
  contractAnswers: Map<string, boolean>;
  setPanchayat: (p: PanchayatData) => void;
  setViabilityInputs: (v: ViabilityInputs) => void;
  setSelectedNeighbours: (n: NeighbouringPanchayat[]) => void;
  toggleNeighbour: (n: NeighbouringPanchayat) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleContractAnswer: (id: string) => void;
  loadDemo: () => void;
}

const AppContext = createContext<AppState>({
  panchayat: null,
  viabilityInputs: defaultViabilityInputs,
  selectedNeighbours: [],
  sidebarOpen: true,
  contractAnswers: new Map(),
  setPanchayat: () => {},
  setViabilityInputs: () => {},
  setSelectedNeighbours: () => {},
  toggleNeighbour: () => {},
  setSidebarOpen: () => {},
  toggleContractAnswer: () => {},
  loadDemo: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [panchayat, setPanchayat] = useState<PanchayatData | null>(null);
  const [viabilityInputs, setViabilityInputs] = useState<ViabilityInputs>(defaultViabilityInputs);
  const [selectedNeighbours, setSelectedNeighbours] = useState<NeighbouringPanchayat[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contractAnswers, setContractAnswers] = useState<Map<string, boolean>>(new Map());

  const toggleNeighbour = useCallback((n: NeighbouringPanchayat) => {
    setSelectedNeighbours(prev => {
      const exists = prev.find(p => p.name === n.name);
      if (exists) return prev.filter(p => p.name !== n.name);
      return [...prev, n];
    });
  }, []);

  const toggleContractAnswer = useCallback((id: string) => {
    setContractAnswers(prev => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, true);
      return next;
    });
  }, []);

  const loadDemo = useCallback(() => {
    setPanchayat(demoPanchayat);
    setViabilityInputs(defaultViabilityInputs);
    setSelectedNeighbours([]);
    setContractAnswers(new Map());
  }, []);

  return (
    <AppContext.Provider value={{
      panchayat,
      viabilityInputs,
      selectedNeighbours,
      sidebarOpen,
      contractAnswers,
      setPanchayat,
      setViabilityInputs,
      setSelectedNeighbours,
      toggleNeighbour,
      setSidebarOpen,
      toggleContractAnswer,
      loadDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
