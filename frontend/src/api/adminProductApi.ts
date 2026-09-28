import { apiClient } from "./client";
import type { Product } from "../types/product";
import type { AdminProductRequest } from "../types/adminProduct";

const createProduct = async (request: AdminProductRequest) => {
  const response = await apiClient.post<Product>(
    "/api/admin/products",
    request
  );

  return response.data;
};

const updateProduct = async (
  productId: number,
  request: AdminProductRequest
) => {
  const response = await apiClient.put<Product>(
    `/api/admin/products/${productId}`,
    request
  );

  return response.data;
};

const deactivateProduct = async (productId: number) => {
  await apiClient.delete(`/api/admin/products/${productId}`);
};

const getAdminProducts = async () => {
  const response = await apiClient.get<Product[]>(
    "/api/admin/products"
  );

  return response.data;
};

export {
  getAdminProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
};