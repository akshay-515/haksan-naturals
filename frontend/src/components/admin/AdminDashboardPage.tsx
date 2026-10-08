import {
  DollarSign,
  Package,
  ShoppingCart,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  const stats = [
    {
      label: "Total Orders",
      value: "—",
      icon: ShoppingCart,
      description: "All customer orders",
    },
    {
      label: "Total Products",
      value: "—",
      icon: Package,
      description: "Products in your store",
    },
    {
      label: "Pending Orders",
      value: "—",
      icon: Clock,
      description: "Orders awaiting processing",
    },
    {
      label: "Revenue",
      value: "—",
      icon: DollarSign,
      description: "Total store revenue",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Overview of your Haksan Naturals store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Icon size={21} strokeWidth={1.9} />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Products */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Manage Products
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Add new products, update product information, manage
                stock, and upload product images.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Package size={19} />
            </div>
          </div>

          <Link
            to="/admin/products"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            View Products
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Manage Orders
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Review customer orders, check payment status, and
                update order delivery status.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <ShoppingCart size={19} />
            </div>
          </div>

          <Link
            to="/admin/orders"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            View Orders
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent store activity will appear here.
          </p>
        </div>

        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Clock
              size={22}
              className="text-gray-400"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-4 text-sm font-medium text-gray-700">
            No recent activity
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Activity data will be connected later.
          </p>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboardPage };