import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Disc, UserPlus, Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { VinylTurntablePlayer } from '../components/music/VinylTurntablePlayer';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(email, password, name);
      navigate('/search');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas grid grid-cols-1 lg:grid-cols-12 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Vinyl Deck Showcase (lg:col-span-7) */}
      <div className="lg:col-span-7 bg-[#f3f0e6] border-b lg:border-b-0 lg:border-r border-hairline/80 relative flex flex-col justify-between p-6 lg:p-10 overflow-hidden shadow-inner">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-pink text-white rounded-xl shadow-md">
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

        {/* Centerpiece: Vinyl Deck Player */}
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

      {/* RIGHT SIDE: Modern Clean Register Form (lg:col-span-5) */}
      <div className="lg:col-span-5 bg-canvas flex flex-col justify-between p-6 lg:p-12 relative overflow-y-auto">
        
        {/* Top Navigation */}
        <div className="flex justify-end items-center mb-6">
          <span className="text-xs text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline ml-1 inline-flex items-center gap-0.5">
              Sign in <ArrowRight className="w-3 h-3" />
            </Link>
          </span>
        </div>

        {/* Register Form Center Box */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <div>
            <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Start building your music catalog and unlock AI-driven insights today.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-card border border-hairline text-ink text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-card border border-hairline text-ink text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-surface-card border border-hairline text-ink text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-muted hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-primary hover:bg-body-strong text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Creating Account...' : 'Get Started Free'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center text-xs text-muted border-t border-hairline/40 mt-6">
          © 2026 Clay Audio Catalog Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
};
