/**
 * Dashboard Service
 * 
 * API service for dashboard data fetching
 */

import axiosInstance from '../../../config/axios';
import { DashboardSummary, PipelineStatus, DailyTrend } from '../types/dashboard.types';

const BASE_URL = '/network/flow/dashboard';

class DashboardService {
  /**
   * Get dashboard summary
   */
  async getSummary(): Promise<DashboardSummary> {
    const response = await axiosInstance.get<DashboardSummary>(`${BASE_URL}/summary`);
    return response.data;
  }

  /**
   * Get all pipeline statuses
   */
  async getPipelineStatuses(date?: string): Promise<PipelineStatus[]> {
    const response = await axiosInstance.get<PipelineStatus[]>(`${BASE_URL}/pipelines`, {
      params: { date },
    });
    return response.data;
  }

  /**
   * Get specific pipeline status
   */
  async getPipelineStatus(id: number, date?: string): Promise<PipelineStatus> {
    const response = await axiosInstance.get<PipelineStatus>(`${BASE_URL}/pipeline/${id}`, {
      params: { date },
    });
    return response.data;
  }

  /**
   * Get daily trends
   */
  async getTrends(startDate?: string, endDate?: string): Promise<DailyTrend[]> {
    const response = await axiosInstance.get<DailyTrend[]>(`${BASE_URL}/trends`, {
      params: { startDate, endDate },
    });
    return response.data;
  }
}

export default new DashboardService();
