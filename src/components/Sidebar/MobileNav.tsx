import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, FileText, Users, ClipboardCheck } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/viability', icon: Calculator, label: 'Viability' },
  { path: '/readiness', icon: ClipboardCheck, label: 'CCTS' },
  { path: '/aggregation', icon: Users, label: 'Cluster' },
  { path: '/decision', icon: FileText, label: 'Decision' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage-200 z-40 lg:hidden">
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors
              ${isActive ? 'text-forest-700' : 'text-charcoal-600'}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
