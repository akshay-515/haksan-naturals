import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  MapPin,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../api/cartApi";
import { getAddresses } from "../../api/addressApi";
import { createOrder } from "../../api/orderApi";
import type { Cart } from "../../types/cart";
import type { Address } from "../../types/address";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const [cartData, addressData] = await Promise.all([
          getCart(),
          getAddresses(),
        ]);

        setCart(cartData);
        setAddresses(addressData);

        if (addressData.length > 0) {
          setSelectedAddressId(addressData[0].id);
        }
      } catch {
        setError("Failed to load checkout details.");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }

    setPlacingOrder(true);
    setError("");

    try {
      const order = await createOrder({
        addressId: selectedAddressId,
      });

      navigate(`/orders/${order.orderId}`);
    } catch {
      setError("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded bg-gray-200" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                <div className="h-32 rounded-2xl bg-gray-200" />
                <div className="h-32 rounded-2xl bg-gray-200" />
              </div>

              <div className="h-80 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <ShoppingBag
              size={34}
              className="text-green-700"
              strokeWidth={1.6}
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-gray-600">
            Add some products before proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Continue shopping
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
            Secure checkout
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Choose your delivery address and review your order.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">

          {/* Left side */}
          <div className="space-y-6">

            {/* Address */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={20}
                      className="text-green-700"
                      strokeWidth={1.8}
                    />

                    <h2 className="text-lg font-semibold text-gray-900">
                      Delivery address
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => navigate("/addresses")}
                    className="hidden items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 sm:flex"
                  >
                    <Plus size={16} />
                    Add new
                  </button>
                )}
              </div>

              {addresses.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <MapPin
                    size={28}
                    className="mx-auto text-gray-400"
                    strokeWidth={1.5}
                  />

                  <p className="mt-3 font-medium text-gray-900">
                    No delivery address saved
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Add an address to continue with your order.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/addresses")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    <Plus size={17} />
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {addresses.map((address) => {
                    const selected =
                      selectedAddressId === address.id;

                    return (
                      <label
                        key={address.id}
                        className={`block cursor-pointer rounded-xl border p-4 transition sm:p-5 ${
                          selected
                            ? "border-green-600 bg-green-50/70 shadow-sm"
                            : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="pt-0.5">
                            <input
                              type="radio"
                              name="address"
                              value={address.id}
                              checked={selected}
                              onChange={() =>
                                setSelectedAddressId(address.id)
                              }
                              className="h-4 w-4 accent-green-700"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {address.name}
                                </h3>

                                <p className="mt-1 text-sm text-gray-600">
                                  {address.phone}
                                </p>
                              </div>

                              {selected && (
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                                  <Check size={14} />
                                </span>
                              )}
                            </div>

                            <p className="mt-3 text-sm leading-6 text-gray-700">
                              {address.addressLine}
                              <br />
                              {address.city}, {address.state}
                              <br />
                              {address.pincode}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => navigate("/addresses")}
                    className="flex items-center gap-1.5 pt-1 text-sm font-medium text-green-700 hover:text-green-800 sm:hidden"
                  >
                    <Plus size={16} />
                    Add or manage addresses
                  </button>
                </div>
              )}
            </section>

            {/* Items */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your items
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {cart.items.length}{" "}
                    {cart.items.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="text-sm font-medium text-green-700 hover:text-green-800"
                >
                  Edit cart
                </button>
              </div>

              <div className="mt-5 divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>

                    <p className="shrink-0 font-semibold text-gray-900">
                      ₹{item.subtotal}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Items
                </span>

                <span className="font-medium text-gray-900">
                  {cart.items.length}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-medium text-gray-900">
                  ₹{cart.totalAmount}
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
              onClick={handlePlaceOrder}
              disabled={
                placingOrder ||
                addresses.length === 0 ||
                selectedAddressId === null
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder ? (
                "Placing Order..."
              ) : (
                <>
                  Place Order
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
              You'll be able to complete payment after your order is created.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export { CheckoutPage };