import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsResponse } from '../types';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BarChart3 } from 'lucide-react';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Catalog Analytics Dashboard
        </h1>
        <p className="text-slate-400 text-sm">
          Analytics computed exclusively from your locally saved albums in PostgreSQL.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Calculating database analytics..." />
      ) : (
        analytics && <AnalyticsCharts analytics={analytics} />
      )}
    </div>
  );
};
