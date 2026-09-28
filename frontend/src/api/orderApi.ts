import { apiClient } from "./Client"; 
import type { Order, OrderCreateRequest } from "../types/order";

const createOrder = async (request: OrderCreateRequest) => {
  const response = await apiClient.post<Order>(
    "/api/orders",
    request
  );

  return response.data;
};

const getOrders = async () => {
  const response = await apiClient.get<Order[]>("/api/orders");

  return response.data;
};

const getOrderById = async (orderId: number) => {
  const response = await apiClient.get<Order>(
    `/api/orders/${orderId}`
  );

  return response.data;
};

export {
  createOrder,
  getOrders,
  getOrderById,
};