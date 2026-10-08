import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem } from "../../api/cartApi";
import type { Cart } from "../../types/cart";

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
      setError("");

      const updatedCart = await updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch {
      setError("Failed to update cart.");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setError("");

      const updatedCart = await removeCartItem(itemId);
      setCart(updatedCart);
    } catch {
      setError("Failed to remove item.");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="mt-8 space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !cart) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">
            {error || "Cart not found."}
          </p>
        </div>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <ShoppingBag
              size={34}
              className="text-green-700"
              strokeWidth={1.6}
            />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-600">
            Looks like you haven't added anything to your cart yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Start shopping
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            Shopping bag
          </p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                {cart.items.length}{" "}
                {cart.items.length === 1 ? "item" : "items"} in your cart.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">

          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.itemId}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">

                  {/* Product image */}
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${item.productId}`)}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover transition hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </button>

                  {/* Product details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/products/${item.productId}`)
                          }
                          className="text-left text-base font-semibold text-gray-900 hover:text-green-700 sm:text-lg"
                        >
                          {item.productName}
                        </button>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{item.price} each
                        </p>
                      </div>

                      <p className="text-base font-bold text-green-700 sm:text-lg">
                        ₹{item.subtotal}
                      </p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.itemId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-10 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.itemId,
                              item.quantity + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(item.itemId)
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-red-600"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-medium text-gray-900">
                  ₹{cart.totalAmount}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Delivery
                </span>

                <span className="font-medium text-green-700">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-green-700">
                ₹{cart.totalAmount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white transition hover:bg-green-800"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-3 w-full rounded-xl px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
            >
              Continue shopping
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export { CartPage };