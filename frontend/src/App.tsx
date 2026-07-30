import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import { Disc, X } from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body font-sans relative">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto overflow-y-auto relative">
          {children}
          <Footer />
        </main>
      </div>

      {/* Floating Vinyl Turntable Deck Drawer Widget */}
      <div className="fixed bottom-6 right-6 z-50">
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
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-white hover:bg-body-strong shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/10 group"
          >
            <div className="w-7 h-7 rounded-full bg-brand-pink text-white flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
              <Disc className="w-4 h-4 animate-spin-slow" />
            </div>
            <span className="text-xs font-semibold tracking-wide">Play Vinyl Deck</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
    </AuthProvider>
  );
};

export default App;
