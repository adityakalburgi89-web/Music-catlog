import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Library, BarChart3, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/search', label: 'iTunes Search', icon: Search },
    { to: '/library', label: 'My Library', icon: Library },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/insights', label: 'AI Insights', icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
        Menu
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        );
      })}
    </aside>
  );
};
