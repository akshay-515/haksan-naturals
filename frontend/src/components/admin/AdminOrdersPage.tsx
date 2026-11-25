
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Filter,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../../api/adminOrderApi";
import type { Order, OrderStatus } from "../../types/order";

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatuses: Order["paymentStatus"][] = [
  "SUCCESS",
  "PENDING",
  "FAILED",
  "REFUNDED",
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
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "CONFIRMED":
      return "bg-blue-50 text-blue-700 ring-blue-200";

    case "PROCESSING":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";

    case "SHIPPED":
      return "bg-purple-50 text-purple-700 ring-purple-200";

    case "DELIVERED":
      return "bg-green-50 text-green-700 ring-green-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-gray-50 text-gray-600 ring-gray-200";
  }
};

const getPaymentStatusClasses = (
  status: Order["paymentStatus"]
) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-50 text-green-700 ring-green-200";

    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "FAILED":
      return "bg-red-50 text-red-700 ring-red-200";

    case "REFUNDED":
      return "bg-gray-50 text-gray-600 ring-gray-200";

    default:
      return "bg-gray-50 text-gray-600 ring-gray-200";
  }
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminOrders();
      setOrders(data);
    } catch {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      setError(
        `Failed to update the status of Order #${orderId}. Please try again.`
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(order.orderId).includes(query) ||
        order.shippingAddress.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const statusCounts = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "PENDING").length,
      processing: orders.filter(
        (order) => order.status === "PROCESSING"
      ).length,
      shipped: orders.filter((order) => order.status === "SHIPPED").length,
      delivered: orders.filter(
        (order) => order.status === "DELIVERED"
      ).length,
    };
  }, [orders]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "ALL" ||
    paymentFilter !== "ALL";

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShoppingCart size={25} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Unable to load orders
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <button
          type="button"
          onClick={() => loadOrders()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage customer orders, payments and fulfilment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            className="shrink-0 font-semibold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Order Summary */}
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {[
          {
            label: "Total Orders",
            value: statusCounts.total,
            color: "text-gray-900",
          },
          {
            label: "Pending",
            value: statusCounts.pending,
            color: "text-amber-700",
          },
          {
            label: "Processing",
            value: statusCounts.processing,
            color: "text-indigo-700",
          },
          {
            label: "Shipped",
            value: statusCounts.shipped,
            color: "text-purple-700",
          },
          {
            label: "Delivered",
            value: statusCounts.delivered,
            color: "text-green-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className="text-xs font-medium text-gray-500 sm:text-sm">
              {stat.label}
            </p>

            <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900">
            Find and filter orders
          </h2>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order ID, product or address..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Order Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="ALL">All Order Statuses</option>

              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Payment Status */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="ALL">All Payment Statuses</option>

              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Clear */}
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={16} />
            Clear
          </button>
        </div>
      </section>

      {/* Result Count */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredOrders.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {orders.length}
          </span>{" "}
          orders
        </p>
      </div>

      {/* Empty State */}
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
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <Search size={25} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No matching orders
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search term or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order.orderId}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-bold text-gray-900">
                      Order #{order.orderId}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      {formatDate(order.createdAt)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Package size={15} />
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Order Total
                    </p>

                    <p className="text-xl font-bold text-green-700">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div className="relative">
                    <select
                      aria-label={`Update status for order ${order.orderId}`}
                      value={order.status}
                      disabled={updatingOrderId === order.orderId}
                      onChange={(event) =>
                        handleStatusChange(
                          order.orderId,
                          event.target.value as OrderStatus
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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

              {/* Order Body */}
              <div className="grid gap-6 p-4 sm:p-5 xl:grid-cols-[1fr_1.2fr]">
                {/* Shipping and Payment */}
                <div className="space-y-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="text-gray-500" />

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Shipping Address
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {order.shippingAddress}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Payment Status
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getPaymentStatusClasses(
                          order.paymentStatus
                        )}`}
                      >
                        {formatStatus(order.paymentStatus)}
                      </span>

                      {updatingOrderId === order.orderId && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock size={14} className="animate-pulse" />
                          Updating order...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Order Items
                    </h3>

                    <span className="text-xs text-gray-500">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "product" : "products"}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-3.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-800">
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
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export { AdminOrdersPage };
