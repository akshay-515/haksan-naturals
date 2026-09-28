import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../api/orderApi";
import type { Order } from "../../types/order";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getOrderById(Number(orderId));
        setOrder(data);
      } catch {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-gray-600">Loading order details...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          {error || "Order not found."}
        </div>

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Order Confirmation
        </h1>

        <p className="mt-2 text-gray-600">
          Your order has been created successfully.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-lg font-semibold text-gray-900">
                  #{order.orderId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-semibold text-gray-900">
                  {order.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-semibold text-gray-900">
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Delivery Address
            </h2>

            <p className="whitespace-pre-line text-gray-700">
              {order.shippingAddress}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Items
            </h2>

            <div className="space-y-5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-6 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.productName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ₹{item.subtotal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-gray-200 p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Order Summary
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-gray-600">
                  {item.productName} × {item.quantity}
                </span>

                <span className="font-medium text-gray-900">
                  ₹{item.subtotal}
                </span>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          {order.paymentStatus === "PENDING" && (
            <button
              type="button"
              onClick={() => {
                // Razorpay integration will be added next.
              }}
              className="mt-6 w-full rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              Pay Now
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-3 w-full rounded-md border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </aside>
      </div>
    </main>
  );
};

export { OrderDetailsPage };