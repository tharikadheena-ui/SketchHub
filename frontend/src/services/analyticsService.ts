import type { AnalyticsData, OverviewData } from '../types/domain';
import { notConnected } from './serviceResult';

export const analyticsService = {
  async getOverview() {
    return notConnected<OverviewData>('Overview');
  },
  async getEventAnalytics(_eventId: string) {
    return notConnected<AnalyticsData>('Analytics');
  },
};