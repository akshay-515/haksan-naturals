import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../api/orderApi";
import type { Order } from "../../types/order";

const OrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-gray-600">Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Orders
        </h1>

        <p className="mt-2 text-gray-600">
          View your previous orders and payment status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No orders yet
          </h2>

          <p className="mt-2 text-gray-600">
            Your completed orders will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-lg border border-gray-200 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900">
                    #{order.orderId}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Order Status
                  </p>

                  <p className="font-medium text-gray-900">
                    {order.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <p className="font-medium text-gray-900">
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="font-semibold text-gray-900">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              <div className="my-5 border-t border-gray-100" />

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {item.productName}
                      </span>

                      <span className="ml-2 text-gray-500">
                        × {item.quantity}
                      </span>
                    </div>

                    <span className="font-medium text-gray-900">
                      ₹{item.subtotal}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/orders/${order.orderId}`)
                }
                className="mt-6 rounded-md border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                View Order
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export { OrdersPage };