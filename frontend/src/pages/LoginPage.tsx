import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/search');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@claymusic.com');
    setPassword('demo1234');
  };

  return (
    <>
      {/* Top Navigation */}
      <div className="flex justify-end items-center mb-4">
        <span className="text-xs text-muted">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline ml-1 inline-flex items-center gap-0.5">
            Sign up <ArrowRight className="w-3 h-3" />
          </Link>
        </span>
      </div>

      {/* Login Form Center Box */}
      <div className="w-full max-w-md mx-auto my-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-muted">
            Log in to manage your music catalog and access your audio analytics dashboard.
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
              Email Address
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo mode: Use password demo1234 or fill demo account'); }} className="text-xs text-muted hover:text-ink">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-muted absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
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
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials Filler Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-medium bg-surface-soft hover:bg-surface-strong border border-hairline text-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Auto-fill Demo Account (demo@claymusic.com)
          </button>
        </div>
      </div>
    </>
  );
};
