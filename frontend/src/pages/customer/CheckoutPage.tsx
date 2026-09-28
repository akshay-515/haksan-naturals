import { useEffect, useState } from "react";
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
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-gray-600">Loading checkout...</p>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Your cart is empty
        </h1>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-6 rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Checkout
      </h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Delivery Address
          </h2>

          {addresses.length === 0 ? (
            <div className="rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">
                You don't have any saved addresses.
              </p>

              <button
                type="button"
                onClick={() => navigate("/addresses")}
                className="mt-4 rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block cursor-pointer rounded-lg border p-5 ${
                    selectedAddressId === address.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() =>
                        setSelectedAddressId(address.id)
                      }
                    />

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {address.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {address.phone}
                      </p>

                      <p className="mt-2 text-sm text-gray-700">
                        {address.addressLine}
                        <br />
                        {address.city}, {address.state}
                        <br />
                        {address.pincode}
                      </p>
                    </div>
                  </div>
                </label>
              ))}

              <button
                type="button"
                onClick={() => navigate("/addresses")}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Manage Addresses
              </button>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-lg border border-gray-200 p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.itemId}
                className="flex justify-between gap-4 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.productName}
                  </p>

                  <p className="text-gray-500">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>

                <p className="font-medium text-gray-900">
                  ₹{item.subtotal}
                </p>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{cart.totalAmount}</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={
              placingOrder ||
              addresses.length === 0 ||
              selectedAddressId === null
            }
            className="mt-6 w-full rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </div>
    </main>
  );
};

export { CheckoutPage };