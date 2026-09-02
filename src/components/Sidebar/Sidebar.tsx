import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FlaskConical,
  Calculator,
  Users,
  FileText,
  Database,
  Info,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Menu,
  ClipboardCheck,
  BookOpen,
} from 'lucide-react';
import { useLang } from '../../contexts/LangContext';
import { useApp } from '../../contexts/AppContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.overview' },
  { path: '/baseline', icon: Layers, labelKey: 'nav.baseline' },
  { path: '/methodology', icon: FlaskConical, labelKey: 'nav.methodology' },
  { path: '/viability', icon: Calculator, labelKey: 'nav.viability' },
  { path: '/aggregation', icon: Users, labelKey: 'nav.aggregation' },
  { path: '/readiness', icon: ClipboardCheck, labelKey: 'nav.readiness' },
  { path: '/decision', icon: FileText, labelKey: 'nav.decision' },
  { path: '/data-sources', icon: Database, labelKey: 'nav.data' },
  { path: '/manual', icon: BookOpen, labelKey: 'nav.manual' },
  { path: '/about', icon: Info, labelKey: 'nav.about' },
];

export default function Sidebar() {
  const { t } = useLang();
  const { panchayat, sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return null;

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-sage-200 rounded-lg p-2 shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={20} className="text-charcoal-700" />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-white border-r border-sage-200 flex flex-col transition-all duration-200 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2 px-4 h-16 border-b border-sage-200 ${!sidebarOpen ? 'lg:justify-center' : ''}`}>
          <Leaf size={22} className="text-forest-700 shrink-0" />
          {sidebarOpen && (
            <span className="font-bold text-forest-800 text-sm tracking-wide">VASUDHA CO2</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map(({ path, icon: Icon, labelKey }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-0.5
                ${isActive
                  ? 'bg-forest-50 text-forest-800 border-l-3 border-forest-600'
                  : 'text-charcoal-700 hover:bg-earth-50 hover:text-charcoal-900'}
                ${!sidebarOpen ? 'lg:justify-center lg:px-2' : ''}`
              }
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{t(labelKey)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Panchayat info */}
        {sidebarOpen && panchayat && (
          <div className="px-3 py-3 border-t border-sage-200">
            <div className="text-xs text-charcoal-600 mb-1">Current Panchayat</div>
            <div className="text-sm font-semibold text-charcoal-900">{panchayat.name}</div>
            <div className="text-xs text-charcoal-600 mt-0.5">
              {panchayat.block}, {panchayat.district}
            </div>
          </div>
        )}

        {/* Collapse toggle - desktop only */}
        <button
          className="hidden lg:flex items-center justify-center h-10 border-t border-sage-200 text-charcoal-600 hover:text-charcoal-900 hover:bg-earth-50 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>
    </>
  );
}
