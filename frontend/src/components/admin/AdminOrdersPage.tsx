import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Package,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { getAdminOrders, updateAdminOrderStatus } from "../../api/adminOrderApi";
import type {
  Order,
  OrderStatus,
} from "../../types/order";

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const formatStatus = (status: string) => {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "PROCESSING":
      return "bg-indigo-100 text-indigo-700";

    case "SHIPPED":
      return "bg-purple-100 text-purple-700";

    case "DELIVERED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getPaymentStatusClasses = (status: Order["paymentStatus"]) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "FAILED":
      return "bg-red-100 text-red-700";

    case "REFUNDED":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(
    null
  );

  const loadOrders = async () => {
    try {
      setError("");

      const data = await getAdminOrders();
      setOrders(data);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: number,
    status: OrderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const updatedOrder = await updateAdminOrderStatus(
        orderId,
        status
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.orderId === updatedOrder.orderId
            ? updatedOrder
            : order
        )
      );
    } catch {
      setError("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Orders
          </h1>

          <p className="mt-2 text-gray-600">
            Manage customer orders and update their status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadOrders}
            className="shrink-0 font-semibold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
            <ShoppingCart size={26} strokeWidth={1.8} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No orders yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Customer orders will appear here once they are placed.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"}
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden space-y-4 md:block">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  {/* Order info */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderId}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                          order.paymentStatus
                        )}`}
                      >
                        Payment: {formatStatus(order.paymentStatus)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={15} />
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Package size={15} />
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>

                  {/* Total + status update */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-700">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={updatingOrderId === order.orderId}
                        onChange={(event) =>
                          handleStatusChange(
                            order.orderId,
                            event.target.value as OrderStatus
                          )
                        }
                        className="appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-gray-500"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Shipping Address
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-700">
                        {order.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-5 border-t border-gray-100 pt-5">
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Order Items
                  </p>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800">
                            {item.productName}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 font-semibold text-gray-900">
                          ₹{item.subtotal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="space-y-4 md:hidden">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Order #{order.orderId}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-green-700">
                    ₹{order.totalAmount}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                      order.paymentStatus
                    )}`}
                  >
                    {formatStatus(order.paymentStatus)}
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-500"
                    />

                    <p className="text-sm leading-5 text-gray-700">
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-gray-900">
                    Items
                  </p>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800">
                            {item.productName}
                          </p>

                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 font-medium text-gray-900">
                          ₹{item.subtotal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-5 border-t border-gray-100 pt-4">
                  <label
                    htmlFor={`status-${order.orderId}`}
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Update Status
                  </label>

                  <select
                    id={`status-${order.orderId}`}
                    value={order.status}
                    disabled={updatingOrderId === order.orderId}
                    onChange={(event) =>
                      handleStatusChange(
                        order.orderId,
                        event.target.value as OrderStatus
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:opacity-60"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute bottom-3.5 right-3 text-gray-400"
                  />

                  {updatingOrderId === order.orderId && (
                    <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} />
                      Updating status...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export { AdminOrdersPage };