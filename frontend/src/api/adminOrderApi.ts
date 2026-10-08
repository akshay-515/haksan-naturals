import { apiClient } from "./client";
import type { Order, OrderStatus } from "../types/order";

const getAdminOrders = async () => {
  const response = await apiClient.get<Order[]>(
    "/api/admin/orders"
  );

  return response.data;
};

const updateAdminOrderStatus = async (
  orderId: number,
  status: OrderStatus
) => {
  const response = await apiClient.put<Order>(
    `/api/admin/orders/${orderId}/status`,
    { status }
  );

  return response.data;
};

export { getAdminOrders, updateAdminOrderStatus };