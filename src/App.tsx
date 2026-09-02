import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { LangProvider } from './contexts/LangContext';
import Sidebar from './components/Sidebar/Sidebar';
import MobileNav from './components/Sidebar/MobileNav';
import Header from './components/shared/Header';
import Landing from './pages/Landing';
import PanchayatSelection from './pages/PanchayatSelection';
import Dashboard from './pages/Dashboard';
import Baseline from './pages/Baseline';
import Methodology from './pages/Methodology';
import Viability from './pages/Viability';
import Aggregation from './pages/Aggregation';
import CCTSReadiness from './pages/CCTSReadiness';
import DecisionPack from './pages/DecisionPack';
import DataSources from './pages/DataSources';
import About from './pages/About';
import UserManual from './pages/UserManual';

function AppLayout() {
  const location = useLocation();
  const { sidebarOpen } = useApp();
  const isLanding = location.pathname === '/';
  const isSelect = location.pathname === '/select';

  if (isLanding || isSelect) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/select" element={<PanchayatSelection />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className={`transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Header />
        <main className="p-4 lg:p-6 max-w-7xl mx-auto pb-20 lg:pb-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/baseline" element={<Baseline />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/viability" element={<Viability />} />
            <Route path="/aggregation" element={<Aggregation />} />
            <Route path="/readiness" element={<CCTSReadiness />} />
            <Route path="/decision" element={<DecisionPack />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/about" element={<About />} />
            <Route path="/manual" element={<UserManual />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
