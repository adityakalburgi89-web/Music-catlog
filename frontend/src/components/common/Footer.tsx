import React from 'react';
import clayAudioIcon from '../../logo/ClayAudio/Clay-Audio-icon.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-soft border-t border-hairline py-12 px-6 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center text-white overflow-hidden p-1">
            <img src={clayAudioIcon} alt="Clay Audio Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-medium text-lg text-ink">
            Clay<span className="text-brand-pink">Catalog</span>
          </span>
          <span className="text-xs text-muted">© 2026 Clay Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-body">
          <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-ink transition-colors">Documentation</a>
          <a href="#" className="hover:text-ink transition-colors">System Status</a>
        </div>
      </div>
    </footer>
  );
};
