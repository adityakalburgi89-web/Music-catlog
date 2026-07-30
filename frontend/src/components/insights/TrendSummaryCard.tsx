import React from 'react';
import { TrendSummaryResponse } from '../../types';
import { Sparkles, Compass, Lightbulb, Clock } from 'lucide-react';

interface TrendSummaryCardProps {
  insights: TrendSummaryResponse;
  onRefresh: () => void;
  isLoading: boolean;
}

export const TrendSummaryCard: React.FC<TrendSummaryCardProps> = ({ insights, onRefresh, isLoading }) => {
  return (
    <div className="space-y-8">
      {/* Dynamic Persona Hero Banner */}
      <div className="relative p-8 sm:p-10 rounded-xl bg-brand-teal text-white shadow-xl overflow-hidden">
        {/* Subtle decorative clay background gradient element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              AI Sonic Persona
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-white mb-3">
              {insights.musicPersona}
            </h2>
            <p className="text-teal-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              {insights.summary}
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start md:self-auto px-6 py-3 rounded-md font-semibold text-xs bg-white text-ink hover:bg-slate-100 shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-brand-pink animate-pulse" />
            {isLoading ? 'Synthesizing...' : 'Refresh AI Insights'}
          </button>
        </div>
      </div>

      {/* Grid of AI Observations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Observations */}
        <div className="p-6 sm:p-8 rounded-xl bg-brand-lavender text-ink shadow-sm">
          <h3 className="font-display font-medium text-xl text-ink mb-5 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-ink" />
            Key Collection Observations
          </h3>
          <ul className="space-y-3">
            {insights.keyObservations.map((obs, index) => (
              <li key={index} className="flex items-start gap-3 p-3.5 rounded-lg bg-white/60 border border-black/5 text-sm text-ink font-medium">
                <span className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Genres */}
        <div className="p-6 sm:p-8 rounded-xl bg-brand-peach text-ink shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-medium text-xl text-ink mb-5 flex items-center gap-2">
              <Compass className="w-5 h-5 text-ink" />
              Recommended Genres to Explore
            </h3>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {insights.recommendedGenresToExplore.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full bg-white text-ink font-semibold text-xs shadow-sm border border-black/5"
                >
                  🎧 {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-800 border-t border-black/10 pt-4 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Generated on {new Date(insights.generatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
