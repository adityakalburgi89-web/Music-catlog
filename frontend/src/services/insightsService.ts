import { api } from './api';
import { TrendSummaryResponse } from '../types';

export const insightsService = {
  async getTrendSummary(focusGenre?: string): Promise<TrendSummaryResponse> {
    const response = await api.post<TrendSummaryResponse>('/insights/trend-summary', { focusGenre });
    return response.data;
  },
};
