import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Library, BarChart3, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/search', label: 'iTunes Search', icon: Search, badgeColor: 'bg-brand-pink' },
    { to: '/library', label: 'My Library', icon: Library, badgeColor: 'bg-brand-teal' },
    { to: '/analytics', label: 'Analytics', icon: BarChart3, badgeColor: 'bg-brand-ochre' },
    { to: '/insights', label: 'AI Insights', icon: Sparkles, badgeColor: 'bg-brand-lavender' },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-surface-soft border-r border-hairline min-h-[calc(100vh-4rem)] p-4 flex-col justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted px-3 mb-2">
          Platform Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-card text-ink shadow-sm border border-hairline'
                    : 'text-body hover:text-ink hover:bg-canvas'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-ink" />
                <span>{item.label}</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${item.badgeColor}`} />
            </NavLink>
          );
        })}
      </div>

      {/* Decorative Clay mini card footer artifact */}
      <div className="p-4 rounded-lg bg-surface-card border border-hairline text-xs space-y-2">
        <div className="font-display font-medium text-sm text-ink flex items-center gap-2">
          <span>Clay Atmosphere</span>
        </div>
        <p className="text-muted leading-relaxed">
          Powered by cream canvas, saturated feature cards, and AI sonic analytics.
        </p>
      </div>
    </aside>
  );
};
