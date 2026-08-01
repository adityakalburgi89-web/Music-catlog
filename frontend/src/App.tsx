import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout } from './components/common/AuthLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { ModernAudioPlayer } from './components/music/ModernAudioPlayer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { PlayerProvider } from './context/PlayerContext';
import { Search, Library, BarChart3, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body font-sans relative pb-32 sm:pb-24">
      <Navbar />

      {/* Mobile Sub Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-surface-soft border-b border-hairline p-2 sticky top-16 z-30 overflow-x-auto text-xs font-semibold whitespace-nowrap">
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shrink-0 ${isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
            }`
          }
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </NavLink>
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shrink-0 ${isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
            }`
          }
        >
          <Library className="w-3.5 h-3.5" />
          <span>Library</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shrink-0 ${isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
            }`
          }
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shrink-0 ${isActive ? 'bg-primary text-white' : 'text-body hover:text-ink'
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

      {/* Modern Audio Player Bar for Application Dashboard */}
      <ModernAudioPlayer />
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
