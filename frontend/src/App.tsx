import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout } from './components/common/AuthLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { VinylTurntablePlayer } from './components/music/VinylTurntablePlayer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Disc, X, Search, Library, BarChart3, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { currentTrack, isPlaying } = usePlayer();

  React.useEffect(() => {
    if (currentTrack) {
      setIsPlayerOpen(true);
    }
  }, [currentTrack]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body font-sans relative">
      <Navbar />

      {/* Mobile Sub Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-surface-soft border-b border-hairline p-2 sticky top-16 z-30 overflow-x-auto text-xs font-semibold">
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
            }`
          }
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </NavLink>
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
            }`
          }
        >
          <Library className="w-3.5 h-3.5" />
          <span>Library</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
            }`
          }
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
            }`
          }
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Insights</span>
        </NavLink>
      </div>

      <div className="flex flex-1 w-full">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto overflow-y-auto relative w-full">
          {children}
          <Footer />
        </main>
      </div>

      {/* Floating Vinyl Turntable Deck Drawer Widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm">
        {isPlayerOpen ? (
          <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-300">
            <button
              onClick={() => setIsPlayerOpen(false)}
              className="absolute -top-3 -right-3 z-50 p-2 rounded-full bg-primary text-white hover:bg-body-strong shadow-lg border border-white/20 transition-transform hover:scale-110"
              title="Close Vinyl Deck"
            >
              <X className="w-4 h-4" />
            </button>
            <VinylTurntablePlayer />
          </div>
        ) : (
          <button
            onClick={() => setIsPlayerOpen(true)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/10 group ${
              isPlaying ? 'bg-brand-pink' : 'bg-primary hover:bg-body-strong'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
              <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin' : 'animate-spin-slow'}`} />
            </div>
            <div className="text-left overflow-hidden max-w-[140px]">
              <span className="text-xs font-semibold tracking-wide block truncate">
                {currentTrack ? currentTrack.title : 'Play Vinyl Deck'}
              </span>
              {currentTrack && (
                <span className="text-[10px] text-white/80 block truncate font-mono">
                  {currentTrack.artist}
                </span>
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route
              path="/"
              element={
                <>
                  <LandingPage />
                  <Footer />
                </>
              }
            />

            {/* Persistent Auth Layout Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/search"
                element={
                  <AppLayout>
                    <SearchPage />
                  </AppLayout>
                }
              />
              <Route
                path="/library"
                element={
                  <AppLayout>
                    <LibraryPage />
                  </AppLayout>
                }
              />
              <Route
                path="/analytics"
                element={
                  <AppLayout>
                    <AnalyticsDashboardPage />
                  </AppLayout>
                }
              />
              <Route
                path="/insights"
                element={
                  <AppLayout>
                    <AIInsightsPage />
                  </AppLayout>
                }
              />
            </Route>

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;
