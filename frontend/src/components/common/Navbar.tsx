import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../context/PlayerContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import clayAudioIcon from '../../logo/ClayAudio/Clay-Audio-icon.png';
import { LogoutModal } from './LogoutModal';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { resetPlayer } = usePlayer();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    resetPlayer();
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline h-16 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-ochre flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform overflow-hidden p-1">
                <img src={clayAudioIcon} alt="Clay Audio Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-display font-medium text-xl text-ink tracking-tight">
                  Clay<span className="text-brand-pink font-bold">Catalog</span>
                </span>
                <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full bg-brand-lavender/40 text-ink font-medium border border-brand-lavender">
                  Insights
                </span>
              </div>
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-soft border border-hairline">
                  <UserIcon className="w-4 h-4 text-ink" />
                  <span className="text-sm font-medium text-ink">{user.name}</span>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-primary text-white hover:bg-body-strong transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-body hover:text-ink transition-colors px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-2 rounded-md bg-primary text-white hover:bg-body-strong transition-colors shadow-sm"
                >
                  Try free
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

