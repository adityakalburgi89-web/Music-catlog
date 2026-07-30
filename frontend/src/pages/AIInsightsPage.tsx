import React, { useState, useEffect } from 'react';
import { insightsService } from '../services/insightsService';
import { TrendSummaryResponse } from '../types';
import { TrendSummaryCard } from '../components/insights/TrendSummaryCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Sparkles } from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<TrendSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const res = await insightsService.getTrendSummary();
      setInsights(res);
    } catch (err) {
      console.error('Failed to generate AI insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 py-4">
      <div className="pb-6 border-b border-hairline">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lavender/40 text-ink text-xs font-semibold mb-3 border border-brand-lavender">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
          LLM Groq Synthesis Engine
        </div>
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-ink" />
          AI-Powered Trend Summary
        </h1>
        <p className="text-body text-sm mt-1">
          Intelligent musicology insights derived from your saved album database.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="AI Engine is synthesizing your catalog trends..." />
      ) : (
        insights && (
          <TrendSummaryCard
            insights={insights}
            onRefresh={fetchInsights}
            isLoading={isLoading}
          />
        )
      )}
    </div>
  );
};
