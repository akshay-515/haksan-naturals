
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getCart } from "../api/cartApi";
import { useAuth } from "./AuthContext";
import { getGuestCart } from "../utils/guestCart";
import type { Cart } from "../types/cart";

interface CartContextValue {
  cart: Cart | null;
  cartCount: number;
  isCartLoading: boolean;
  cartError: string;
  refreshCart: () => Promise<void>;
  syncCart: (updatedCart: Cart) => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated, isAuthReady } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  // Prevent an older cart request from overwriting newer cart state.
  const requestId = useRef(0);

  const refreshCart = useCallback(async () => {
    if (!isAuthReady) {
      return;
    }

    const currentRequestId = ++requestId.current;

    setIsCartLoading(true);
    setCartError("");

    try {
      const updatedCart = isAuthenticated
        ? await getCart()
        : getGuestCart();

      if (currentRequestId === requestId.current) {
        setCart(updatedCart);
      }
    } catch {
      if (currentRequestId === requestId.current) {
        setCartError("Failed to load cart.");
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsCartLoading(false);
      }
    }
  }, [isAuthenticated, isAuthReady]);

  useEffect(() => {
    if (isAuthReady) {
      void refreshCart();
    }
  }, [isAuthReady, isAuthenticated, refreshCart]);

  // Update shared cart state after add, remove, or quantity changes.
  const syncCart = (updatedCart: Cart) => {
    setCart(updatedCart);
    setCartError("");
  };

  // Count total product quantities, not distinct cart lines.
  const cartCount =
    cart?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isCartLoading,
        cartError,
        refreshCart,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};

export { CartProvider, useCart };
