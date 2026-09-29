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

const activateProduct = async (productId: number) => {
  await apiClient.put(`/api/admin/products/${productId}/activate`)
}

const uploadProductImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<{ imageUrl: string }>(
    "/api/admin/products/image",
    formData
  );

  return response.data;
};

export {
  getAdminProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
  activateProduct,
  uploadProductImage
};