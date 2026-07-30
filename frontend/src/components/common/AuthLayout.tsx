import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Disc } from 'lucide-react';
import { VinylTurntablePlayer } from '../music/VinylTurntablePlayer';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas grid grid-cols-1 lg:grid-cols-12 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Persistent Vinyl Deck Showcase (lg:col-span-7) */}
      <div className="lg:col-span-7 bg-[#f3f0e6] border-b lg:border-b-0 lg:border-r border-hairline/80 relative flex flex-col justify-between p-6 lg:p-10 overflow-hidden shadow-inner">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-peach/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2.5 bg-primary text-white rounded-xl shadow-md">
              <Disc className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-ink tracking-tight block">
                Clay Audio
              </span>
              <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                Music Catalog Deck
              </span>
            </div>
          </Link>
        </div>

        {/* Centerpiece: Persistent Vinyl Deck Player (Keeps playing during route toggles) */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
          <div className="scale-95 sm:scale-100">
            <VinylTurntablePlayer />
          </div>
        </div>

        {/* Bottom Tagline Quote */}
        <div className="relative z-10 pt-4 border-t border-hairline/60 flex flex-col sm:flex-row justify-between items-center text-xs text-muted font-mono gap-2">
          <span>ANALOG PRECISION • DIGITAL CATALOG</span>
          <span>EST. 2026</span>
        </div>
      </div>

      {/* RIGHT SIDE: Dynamic Auth Route Form ({children} via Outlet) */}
      <div className="lg:col-span-5 bg-canvas flex flex-col justify-between p-6 lg:p-12 relative overflow-y-auto">
        <Outlet />
        
        {/* Footer */}
        <div className="pt-6 text-center text-xs text-muted border-t border-hairline/40 mt-6">
          © 2026 Clay Audio Catalog Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
};
