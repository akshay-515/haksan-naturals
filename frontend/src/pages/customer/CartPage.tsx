import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem } from "../../api/cartApi";
import type { Cart } from "../../types/cart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart();

        setCart(data);
      } catch {
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleQuantityChange = async (
    itemId: number,
    quantity: number
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      const updatedCart = await updateCartItem(itemId, quantity);

      setCart(updatedCart);
    } catch {
      setError("Failed to update cart.");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const updatedCart = await removeCartItem(itemId);

      setCart(updatedCart);
    } catch {
      setError("Failed to remove item.");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-gray-600">Loading cart...</p>
      </main>
    );
  }

  if (error || !cart) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-red-600">
          {error || "Cart not found."}
        </p>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Your Cart
        </h2>

        <p className="mt-4 text-gray-600">
          Your cart is empty.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900">
        Your Cart
      </h2>

      <div className="mt-8 space-y-4">
        {cart.items.map((item) => (
        <div
          key={item.itemId}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div>
            <h3 className="font-semibold text-gray-900">
              {item.productName}
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              ₹{item.price}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.itemId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
                className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                −
              </button>

              <span className="min-w-6 text-center">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.itemId, item.quantity + 1)
                }
                className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => handleRemoveItem(item.itemId)}
                className="ml-3 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>

          <p className="font-semibold text-gray-900">
            ₹{item.subtotal}
          </p>
        </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">
              Total
            </span>

            <span className="text-xl font-bold text-green-700">
              ₹{cart.totalAmount}
            </span>
          </div>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
        </div>
      </div>

      
    </main>
  );
};

export { CartPage };