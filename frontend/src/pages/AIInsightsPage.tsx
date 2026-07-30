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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          AI-Powered Trend Summary
        </h1>
        <p className="text-slate-400 text-sm">
          Intelligent musicology analysis derived from your personal album collection.
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
