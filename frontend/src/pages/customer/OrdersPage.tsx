import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../api/orderApi";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../types/order";

const formatPaymentStatus = (status: PaymentStatus) => {
  switch (status) {
    case "PENDING":
      return "Payment pending";
    case "SUCCESS":
      return "Paid";
    case "FAILED":
      return "Payment failed";
    case "REFUNDED":
      return "Refunded";
  }
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = {
    PENDING: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700",
      icon: Clock3,
    },
    CONFIRMED: {
      label: "Confirmed",
      className: "bg-blue-50 text-blue-700",
      icon: CheckCircle2,
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-blue-50 text-blue-700",
      icon: Package,
    },
    SHIPPED: {
      label: "Shipped",
      className: "bg-purple-50 text-purple-700",
      icon: Truck,
    },
    DELIVERED: {
      label: "Delivered",
      className: "bg-green-50 text-green-700",
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

const PaymentStatusBadge = ({
  status,
}: {
  status: PaymentStatus;
}) => {
  const config = {
    PENDING: {
      className: "bg-amber-50 text-amber-700",
    },
    SUCCESS: {
      className: "bg-green-50 text-green-700",
    },
    FAILED: {
      className: "bg-red-50 text-red-700",
    },
    REFUNDED: {
      className: "bg-purple-50 text-purple-700",
    },
  }[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {formatPaymentStatus(status)}
    </span>
  );
};

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
      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />

            <div className="mt-8 space-y-5">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-56 rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
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

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            Your account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Track your orders and view your payment status.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <ShoppingBag
                size={34}
                className="text-green-700"
                strokeWidth={1.6}
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Once you place an order, you'll be able to track it
              and view its details here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Start Shopping
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <article
                key={order.orderId}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Order
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-gray-900">
                        #{order.orderId}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 py-5 sm:px-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.productName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-gray-900">
                          ₹{item.subtotal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex flex-wrap items-center gap-3">
                      <PaymentStatusBadge
                        status={order.paymentStatus}
                      />

                      <div className="h-4 w-px bg-gray-300" />

                      <div>
                        <span className="text-xs text-gray-500">
                          Total
                        </span>

                        <span className="ml-2 font-bold text-gray-900">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/orders/${order.orderId}`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:text-green-700"
                    >
                      View Order
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export { OrdersPage };