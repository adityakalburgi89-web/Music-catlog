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
    <div className="space-y-6">
      {/* Dynamic Persona Hero Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Sonic Persona
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              {insights.musicPersona}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {insights.summary}
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            {isLoading ? 'Re-analyzing Catalog...' : 'Refresh AI Analysis'}
          </button>
        </div>
      </div>

      {/* Grid of AI Observations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Observations */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Key Collection Insights
          </h3>
          <ul className="space-y-3">
            {insights.keyObservations.map((obs, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20 shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Genres */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              Recommended Genres to Explore Next
            </h3>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {insights.recommendedGenresToExplore.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-200 font-semibold text-xs shadow-sm hover:border-purple-500/50 transition-colors"
                >
                  🎧 {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-800/80 pt-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Generated on {new Date(insights.generatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
