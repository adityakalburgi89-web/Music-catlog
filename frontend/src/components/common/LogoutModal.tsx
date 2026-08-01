import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
      <div
        className="bg-canvas border border-hairline rounded-xl max-w-sm w-full p-6 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-muted hover:text-ink hover:bg-surface-soft transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand-pink/15 flex items-center justify-center mb-4 text-brand-pink border border-brand-pink/30">
            <LogOut className="w-6 h-6 ml-0.5" />
          </div>

          <h3 id="logout-modal-title" className="font-display font-semibold text-lg text-ink mb-1">
            Sign Out Confirmation
          </h3>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Are you sure you want to log out?
          </p>

          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-body bg-surface-soft hover:bg-surface-strong border border-hairline transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-md text-sm font-semibold bg-brand-pink hover:bg-rose-600 text-white shadow-sm transition-all active:scale-95"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
