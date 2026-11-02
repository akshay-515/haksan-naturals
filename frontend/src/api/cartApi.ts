import { apiClient } from "./client";
import type { Cart } from "../types/cart";
import { getGuestCart, clearGuestCart } from "../utils/guestCart";

interface CartItemRequest {
  productId: number;
  quantity: number;
}

const getCart = async (): Promise<Cart> => {
  const response = await apiClient.get<Cart>("/api/cart");
  return response.data;
};

const addToCart = async (request: CartItemRequest): Promise<Cart> => {
  const response = await apiClient.post<Cart>(
    "/api/cart/items",
    request
  );

  return response.data;
};

const mergeGuestCartIntoAccount = async (): Promise<Cart> => {
  const guestCart = getGuestCart();
  let backendCart = await getCart();

  for (const guestItem of guestCart.items) {
    const existingItem = backendCart.items.find(
      (item) => item.productId === guestItem.productId
    );

    const existingQuantity = existingItem?.quantity ?? 0;
    const quantityToAdd = guestItem.quantity - existingQuantity;

    if (quantityToAdd > 0) {
      backendCart = await addToCart({
        productId: guestItem.productId,
        quantity: quantityToAdd,
      });
    }
  }

  clearGuestCart();

  return backendCart;
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
  mergeGuestCartIntoAccount,
};