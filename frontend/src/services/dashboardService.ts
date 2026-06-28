import api from "./api";
import type { Activity } from "./activityService";

export interface DashboardData {
  totalLeads: number;
  totalCustomers: number;
  totalOpportunities: number;
  pipelineValue: number;
  totalRevenue: number;
  conversionRate: string;
  recentActivities: Activity[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await api.get("/dashboard");
  return response.data;
}
