import type { Product } from "../types/product";
import type { Cart, CartItem } from "../types/cart";

const GUEST_CART_KEY = "haksan_guest_cart";

const createGuestCartItem = (
  product: Product,
  quantity: number
): CartItem => ({
  itemId: product.id,
  productId: product.id,
  productName: product.name,
  price: product.price,
  imageUrl: product.imageUrl,
  quantity,
  subtotal: product.price * quantity,
  stock: product.stock,
});

const buildGuestCart = (items: CartItem[]): Cart => ({
  cartId: 0,
  items,
  totalAmount: items.reduce(
    (total, item) => total + item.subtotal,
    0
  ),
});

const getGuestCart = (): Cart => {
  try {
    const storedCart = localStorage.getItem(GUEST_CART_KEY);

    if (!storedCart) {
      return buildGuestCart([]);
    }

    const items = JSON.parse(storedCart) as CartItem[];

    return buildGuestCart(items);
  } catch {
    return buildGuestCart([]);
  }
};

const saveGuestCart = (items: CartItem[]): Cart => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  return buildGuestCart(items);
};

const addGuestCartItem = (
  product: Product,
  quantity: number
): Cart => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  const cart = getGuestCart();
  const existingItem = cart.items.find(
    (item) => item.productId === product.id
  );

  const currentQuantity = existingItem?.quantity ?? 0;
  const newQuantity = currentQuantity + quantity;

  if (newQuantity > product.stock) {
    throw new Error(
      `Only ${product.stock} units are available.`
    );
  }

  const updatedItems = existingItem
    ? cart.items.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              price: product.price,
              stock: product.stock,
              quantity: newQuantity,
              subtotal: product.price * newQuantity,
            }
          : item
      )
    : [...cart.items, createGuestCartItem(product, quantity)];

  return saveGuestCart(updatedItems);
};

const updateGuestCartItem = (
  productId: number,
  quantity: number
): Cart => {
  const cart = getGuestCart();

  const updatedItems = cart.items
    .map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity,
            subtotal: item.price * quantity,
          }
        : item
    )
    .filter((item) => item.quantity > 0);

  return saveGuestCart(updatedItems);
};

const removeGuestCartItem = (productId: number): Cart => {
  const cart = getGuestCart();

  const updatedItems = cart.items.filter(
    (item) => item.productId !== productId
  );

  return saveGuestCart(updatedItems);
};

const clearGuestCart = (): void => {
  localStorage.removeItem(GUEST_CART_KEY);
};

const saveCartAsGuestCart = (cart: Cart): Cart => {
  const guestItems: CartItem[] = cart.items.map((item) => ({
    ...item,
    itemId: item.productId,
  }));

  return saveGuestCart(guestItems);
};


export {
  getGuestCart,
  addGuestCartItem,
  updateGuestCartItem,
  removeGuestCartItem,
  clearGuestCart,
  saveCartAsGuestCart,
};