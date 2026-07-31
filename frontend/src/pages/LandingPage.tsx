import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { VinylTurntablePlayer } from '../components/music/VinylTurntablePlayer';
import { VerifiedCompanyLogos } from '../components/common/VerifiedCompanyLogos';
import clayAudioIcon from '../logo/ClayAudio/Clay-Audio-icon.png';
import {
  Search,
  Sparkles,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-canvas text-body font-sans selection:bg-brand-pink selection:text-white">
      {/* Pinned Cream Top Nav */}
      <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-hairline h-16 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-ochre flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform overflow-hidden p-1">
              <img src={clayAudioIcon} alt="Clay Audio Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-medium text-xl text-ink tracking-tight">
                Clay<span className="text-brand-pink font-bold">Catalog</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2.5 py-0.5 rounded-full bg-brand-lavender/40 text-ink font-medium border border-brand-lavender">
                Insights
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-body">
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="#analytics" className="hover:text-ink transition-colors">Analytics</a>
            <a href="#ai-engine" className="hover:text-ink transition-colors">AI Engine</a>
            <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-md bg-primary text-white hover:bg-body-strong transition-colors shadow-sm"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-medium text-body hover:text-ink transition-colors px-2 sm:px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-md bg-primary text-white hover:bg-body-strong transition-colors shadow-sm"
                >
                  Try free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 1. Hero Band (7-5 Split Grid) */}
      <section className="pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-peach/40 text-ink text-xs font-semibold border border-brand-peach">
              <Sparkles className="w-4 h-4 text-brand-pink" />
              The Playful B2B Music Intelligence Platform
            </div>

            <h1 className="font-display font-medium text-4xl sm:text-6xl lg:text-7xl tracking-tight text-ink leading-[1.05]">
              Go to market with unique music data.
            </h1>

            <p className="hidden sm:block text-body text-lg sm:text-xl max-w-2xl leading-relaxed">
              Discover albums live from iTunes, curate personal catalogs in PostgreSQL, and unlock AI-powered sonic trend insights.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={isAuthenticated ? "/search" : "/register"}
                className="px-7 py-3.5 rounded-md bg-primary hover:bg-body-strong text-white font-semibold text-base shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                Start curating free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="px-5 py-3.5 text-sm font-semibold text-ink hover:underline flex items-center gap-1.5"
              >
                Explore platform features
              </a>
            </div>

            {/* Social Trust Badges with Verified Company Logos */}
            <VerifiedCompanyLogos />
          </div>

          {/* Right Column Interactive Vinyl Turntable Player (5 cols) - Hidden on Mobile View */}
          <div className="hidden sm:flex lg:col-span-5 justify-center">
            <VinylTurntablePlayer />
          </div>
        </div>
      </section>

      {/* 2. Saturated 6-Color Feature Card Palette Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-hairline">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-lavender/40 text-ink text-xs font-semibold border border-brand-lavender">
            Feature Spectrum
          </span>
          <h2 className="font-display font-medium text-4xl sm:text-5xl tracking-tight text-ink">
            Everything you need for music intelligence
          </h2>
          <p className="text-body text-base">
            Curate, search, aggregate, and synthesize music data with six specialized platform layers.
          </p>
        </div>

        {/* 6-Color Grid (3-Up) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Hot Pink */}
          <div className="p-8 rounded-xl bg-brand-pink text-white flex flex-col justify-between shadow-md hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-medium text-2xl mb-3 text-white">iTunes Search API Proxy</h3>
              <p className="text-pink-100 text-sm leading-relaxed mb-6">
                Search global album metadata live from Apple's iTunes Search API with built-in caching and URL-encoding.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/10 text-xs font-mono text-white">
              GET /api/search?query=Daft+Punk
            </div>
          </div>

          {/* Card 2: Deep Teal */}
          <div className="p-8 rounded-xl bg-brand-teal text-white flex flex-col justify-between shadow-md hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-medium text-2xl mb-3 text-white">PostgreSQL Catalog</h3>
              <p className="text-teal-100 text-sm leading-relaxed mb-6">
                Save albums into your personal database with unique constraint isolation `(user_id, apple_catalog_id)`.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/10 text-xs font-mono text-white">
              Constraint: uq_user_apple_catalog
            </div>
          </div>

          {/* Card 3: Soft Lavender */}
          <div className="p-8 rounded-xl bg-brand-lavender text-ink flex flex-col justify-between shadow-md hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display font-medium text-2xl mb-3 text-ink">Groq LLM AI Summaries</h3>
              <p className="text-slate-800 text-sm leading-relaxed mb-6">
                Generate dynamic music persona titles, key collection observations, and recommended genre explorations.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/60 text-xs font-mono text-ink">
              Model: llama-3.1-8b-instant
            </div>
          </div>

          {/* Card 4: Warm Peach */}
          <div className="p-8 rounded-xl bg-brand-peach text-ink flex flex-col justify-between shadow-md hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-medium text-2xl mb-3 text-ink">Decade & Track Spread</h3>
              <p className="text-slate-800 text-sm leading-relaxed mb-6">
                Visualize release dates by decade and track count distributions (1-5, 6-10, 11-15, 16+ tracks).
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/60 text-xs font-mono text-ink">
              Aggregations: Recharts BarChart
            </div>
          </div>

          {/* Card 5: Ochre */}
          <div className="p-8 rounded-xl bg-brand-ochre text-ink flex flex-col justify-between shadow-md hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center mb-6">
                <Star className="w-6 h-6 fill-white" />
              </div>
              <h3 className="font-display font-medium text-2xl mb-3 text-ink">1-5 Star Ratings & Notes</h3>
              <p className="text-slate-800 text-sm leading-relaxed mb-6">
                Rate saved albums from 1 to 5 stars and add personal listening notes up to 1000 characters.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/60 text-xs font-mono text-ink">
              User Notes: max 1000 chars
            </div>
          </div>

          {/* Card 6: Cream Surface */}
          <div className="p-8 rounded-xl bg-surface-card border border-hairline text-ink flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-medium text-2xl mb-3 text-ink">Stateless JWT Security</h3>
              <p className="text-body text-sm leading-relaxed mb-6">
                Spring Security 6 stateless JWT tokens with BCrypt password hashing and CORS environment configuration.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-surface-strong text-xs font-mono text-ink border border-hairline">
              Auth: Bearer JWT Token
            </div>
          </div>
        </div>
      </section>

      {/* 3. Testimonial Cards Band */}
      <section className="py-20 bg-surface-soft border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-ink">
              Loved by music architects & data engineers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-surface-card border border-hairline space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-pink text-white font-bold text-sm flex items-center justify-center">
                  JD
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-ink">Jane Doe</h4>
                  <p className="text-xs text-muted">Head of Catalog Operations</p>
                </div>
              </div>
              <p className="text-body text-sm italic">
                "The Clay aesthetic makes data curation feel fun again. iTunes search proxy + Groq AI summaries saved us hundreds of manual research hours."
              </p>
            </div>

            <div className="p-6 rounded-lg bg-surface-card border border-hairline space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-teal text-white font-bold text-sm flex items-center justify-center">
                  AR
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-ink">Alex Rivera</h4>
                  <p className="text-xs text-muted">Senior Data Architect</p>
                </div>
              </div>
              <p className="text-body text-sm italic">
                "Spring Boot 3 + PostgreSQL unique constraints give us complete isolation, while the Recharts dashboard displays decade trends instantly."
              </p>
            </div>

            <div className="p-6 rounded-lg bg-surface-card border border-hairline space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-ochre text-ink font-bold text-sm flex items-center justify-center">
                  MK
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-ink">Marcus Chen</h4>
                  <p className="text-xs text-muted">A&R Data Lead</p>
                </div>
              </div>
              <p className="text-body text-sm italic">
                "ClayCatalog's 6-color palette and rounded typography is the most refreshing SaaS interface we've used in years."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing Tiers Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-hairline">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-peach/40 text-ink text-xs font-semibold border border-brand-peach">
            Transparent Pricing
          </span>
          <h2 className="font-display font-medium text-4xl text-ink">
            Simple plans for every catalog size
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1: Free */}
          <div className="p-8 rounded-lg bg-canvas border border-hairline space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-medium text-xl text-ink">Free Starter</h3>
              <p className="text-xs text-muted mt-1">For individual music enthusiasts</p>
              <div className="my-6">
                <span className="font-display font-medium text-4xl text-ink">$0</span>
                <span className="text-xs text-muted"> / forever</span>
              </div>
              <ul className="space-y-3 text-xs text-body">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Save up to 50 Albums</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live iTunes API Proxy</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Basic Recharts Analytics</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 text-center rounded-md border border-hairline font-semibold text-xs text-ink hover:bg-surface-soft transition-colors"
            >
              Get started free
            </Link>
          </div>

          {/* Tier 2: Featured Deep Teal Card */}
          <div className="p-8 rounded-xl bg-brand-teal text-white space-y-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-pink text-white text-xs font-bold">
              MOST POPULAR
            </div>
            <div>
              <h3 className="font-display font-medium text-xl text-white">Pro Curator</h3>
              <p className="text-xs text-teal-100 mt-1">For professional A&R & data teams</p>
              <div className="my-6">
                <span className="font-display font-medium text-4xl text-white">$29</span>
                <span className="text-xs text-teal-200"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-teal-50">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-pink" /> Unlimited Saved Albums</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-pink" /> Groq LLM AI Trend Engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-pink" /> Full Analytics & Decade Spread</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-pink" /> 1-5 Star Ratings & Notes</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 text-center rounded-md bg-white text-ink hover:bg-slate-100 font-semibold text-xs transition-colors shadow-md"
            >
              Start 14-day trial
            </Link>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="p-8 rounded-lg bg-canvas border border-hairline space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-medium text-xl text-ink">Enterprise Catalog</h3>
              <p className="text-xs text-muted mt-1">For record labels & distributors</p>
              <div className="my-6">
                <span className="font-display font-medium text-4xl text-ink">$99</span>
                <span className="text-xs text-muted"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-body">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Everything in Pro Curator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dedicated Neon PostgreSQL DB</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom OpenAPI & SLA Support</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 text-center rounded-md border border-hairline font-semibold text-xs text-ink hover:bg-surface-soft transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Pre-Footer Illustrated CTA Band */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-16 rounded-xl bg-surface-soft border border-hairline text-center space-y-6 relative overflow-hidden shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-brand-ochre flex items-center justify-center text-ink shadow-md mx-auto">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-5xl text-ink max-w-2xl mx-auto leading-tight">
            Turn your growth ideas into reality today.
          </h2>
          <p className="text-body text-base max-w-xl mx-auto">
            Join thousands of music architects building smart catalogs with Clay.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? "/search" : "/register"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-primary hover:bg-body-strong text-white font-semibold text-base shadow-md transition-all active:scale-95"
            >
              Start curating free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
