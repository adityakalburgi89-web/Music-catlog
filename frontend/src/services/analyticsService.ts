import { api } from './api';
import { AnalyticsResponse } from '../types';

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsResponse> {
    const response = await api.get<AnalyticsResponse>('/analytics');
    return response.data;
  },
};
