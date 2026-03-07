import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Scale,
  Search,
  Calendar,
  MessageSquare,
  Gavel,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/documents', icon: FileText, label: 'Documentos' },
  { to: '/petitions', icon: Scale, label: 'Petições' },
  { to: '/search', icon: Search, label: 'Pesquisa' },
  { to: '/deadlines', icon: Calendar, label: 'Prazos' },
  { to: '/chat', icon: MessageSquare, label: 'Assistente' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
          <Gavel className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-gray-900">Legal AI</span>
          <p className="text-xs text-gray-500">Assistente Jurídico</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">Legal AI Assistant v1.0</p>
      </div>
    </aside>
  );
}
