import { apiClient } from "./client";
import type { Cart } from "../types/cart";

interface CartItemRequest {
  productId: number;
  quantity: number;
}

const getCart = async () => {
  const response = await apiClient.get<Cart>("/api/cart");

  return response.data;
};

const addToCart = async (request: CartItemRequest) => {
  const response = await apiClient.post<Cart>(
    "/api/cart/items",
    request
  );

  return response.data;
};

const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await apiClient.put<Cart>(
    `/api/cart/items/${itemId}`,
    null,
    {
      params: {
        quantity,
      },
    }
  );

  return response.data;
};

const removeCartItem = async (itemId: number) => {
  const response = await apiClient.delete<Cart>(
    `/api/cart/items/${itemId}`
  );

  return response.data;
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};