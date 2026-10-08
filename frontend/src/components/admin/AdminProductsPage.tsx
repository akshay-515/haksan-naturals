import { useEffect, useState } from "react";
import {
  Edit,
  Package,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  activateProduct,
  deactivateProduct,
  getAdminProducts,
} from "../../api/adminProductApi";
import type { Product } from "../../types/product";

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setError("");

      const data = await getAdminProducts();
      setProducts(data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeactivate = async (productId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deactivateProduct(productId);
      await loadProducts();
    } catch {
      setError("Failed to deactivate product.");
    }
  };

  const handleActivate = async (productId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to activate this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await activateProduct(productId);
      await loadProducts();
    } catch {
      setError("Failed to activate product.");
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-4 w-56 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
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
            Products
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your Haksan Naturals products.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadProducts}
            className="shrink-0 font-semibold text-red-700 hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
            <Package size={26} strokeWidth={1.8} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No products yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Start building your store catalog by adding your first
            product.
          </p>

          <Link
            to="/admin/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      ) : (
        <>
          {/* Product count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <Package size={19} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              Product #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{product.price}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock > 0
                              ? "text-gray-700"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            product.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.active
                                ? "bg-green-600"
                                : "bg-gray-400"
                            }`}
                          />
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Edit size={16} />
                            Edit
                          </Link>

                          {product.active ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeactivate(product.id)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <PowerOff size={16} />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleActivate(product.id)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                            >
                              <Power size={16} />
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Product #{product.id}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium text-green-700">
                      {product.category}
                    </p>

                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{product.price}
                      </p>

                      <p
                        className={`text-sm ${
                          product.stock > 0
                            ? "text-gray-500"
                            : "font-medium text-red-600"
                        }`}
                      >
                        {product.stock} in stock
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>

                  {product.active ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeactivate(product.id)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      <PowerOff size={16} />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleActivate(product.id)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-100"
                    >
                      <Power size={16} />
                      Activate
                    </button>
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

export { AdminProductsPage };