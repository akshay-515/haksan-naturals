import { apiClient } from "./client";

export interface AdminDashboardResponse {
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
}

const getDashboardStats = async (): Promise<AdminDashboardResponse> => {
  const response = await apiClient.get<AdminDashboardResponse>(
    "/api/admin/dashboard"
  );

  return response.data;
};

export { getDashboardStats };