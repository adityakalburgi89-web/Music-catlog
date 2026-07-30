import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Disc3, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Disc3 className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Music Catalog
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                Insights
              </span>
            </div>
          </Link>

          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">{user.fullName}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
