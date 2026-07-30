import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { AIInsightsPage } from './pages/AIInsightsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
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
          <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
