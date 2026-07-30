import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Disc } from 'lucide-react';
import { VinylTurntablePlayer } from '../music/VinylTurntablePlayer';
import { Pattern } from './Pattern';
import lofiArtImg from '../../imgs/lofi-music-art.png';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas grid grid-cols-1 lg:grid-cols-12 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Persistent Vinyl Deck Showcase (lg:col-span-7) */}
      <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-hairline/80 relative flex flex-col justify-between p-6 lg:p-10 overflow-hidden shadow-inner">
        {/* Animated Rotating Pastel Pattern Background */}
        <Pattern className="pointer-events-none z-0" />

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

      {/* RIGHT SIDE: Dynamic Auth Route Form with Lo-Fi Background Image ({children} via Outlet) */}
      <div className="lg:col-span-5 relative flex flex-col justify-between p-6 lg:p-10 overflow-y-auto bg-canvas">
        {/* Full Background Image Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={lofiArtImg}
            alt="Lo-fi Music Studio Background"
            className="w-full h-full object-cover object-center opacity-35 filter brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas/80 via-canvas/60 to-canvas/90 backdrop-blur-[2px]" />
        </div>

        {/* Form Container with high z-index */}
        <div className="relative z-10 flex flex-col justify-between min-h-full">
          <Outlet />
          
          {/* Footer */}
          <div className="pt-6 text-center text-xs text-muted border-t border-hairline/40 mt-6 font-medium">
            © 2026 Clay Audio Catalog Platform. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

