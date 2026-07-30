import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsResponse } from '../types';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BarChart3, Sparkles } from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await analyticsService.getAnalytics();
        setAnalytics(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 py-4">
      <div className="pb-6 border-b border-hairline">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-ochre/30 text-ink text-xs font-semibold mb-3 border border-brand-ochre/40">
          <Sparkles className="w-3.5 h-3.5" />
          Database Aggregations
        </div>
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-ink" />
          Catalog Analytics Dashboard
        </h1>
        <p className="text-body text-sm mt-1">
          Metrics computed exclusively from saved albums in PostgreSQL database.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Compiling PostgreSQL database aggregations..." />
      ) : (
        analytics && <AnalyticsCharts analytics={analytics} />
      )}
    </div>
  );
};
