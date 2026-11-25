
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Filter,
  Package,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  activateProduct,
  deactivateProduct,
  getAdminProducts,
} from "../../api/adminProductApi";
import type { Product } from "../../types/product";
import { PRODUCT_CATEGORIES } from "../../types/constants/productCategories";

const LOW_STOCK_THRESHOLD = 5;

type ProductAction = {
  product: Product;
  action: "activate" | "deactivate";
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const hasDiscount = (product: Product) =>
  product.discountedPrice != null &&
  product.discountedPrice > 0 &&
  product.discountedPrice < product.price;

const getDiscountPercentage = (product: Product) =>
  Math.round(
    ((product.price - product.discountedPrice!) / product.price) * 100
  );

const getStockStatus = (stock: number) => {
  if (stock <= 0) {
    return {
      label: "Out of stock",
      classes: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: "Low stock",
      classes: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    };
  }

  return {
    label: "In stock",
    classes: "bg-green-50 text-green-700",
    dot: "bg-green-500",
  };
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selectedAction, setSelectedAction] =
    useState<ProductAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    setError("");

    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch {
      setError("Unable to load products. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch === "" ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        String(product.id).includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" && product.active) ||
        (selectedStatus === "Inactive" && !product.active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const activeCount = products.filter((product) => product.active).length;
  const inactiveCount = products.length - activeCount;
  const lowStockCount = products.filter(
    (product) => product.stock <= LOW_STOCK_THRESHOLD
  ).length;

  const hasFilters =
    search.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedStatus !== "All";

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  const handleProductAction = async () => {
    if (!selectedAction || actionLoading) {
      return;
    }

    const { product, action } = selectedAction;

    setActionLoading(true);
    setError("");

    try {
      if (action === "deactivate") {
        await deactivateProduct(product.id);
      } else {
        await activateProduct(product.id);
      }

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, active: action === "activate" }
            : item
        )
      );

      setSelectedAction(null);
    } catch {
      setError(
        `Unable to ${action} "${product.name}". Please try again.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Products
            </h1>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
              {products.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Manage your store catalogue, pricing and stock.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadProducts(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/products/new"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 sm:flex-none"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Active Products
              </p>
              <p className="mt-0.5 text-xl font-bold text-gray-900">
                {activeCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Inactive Products
              </p>
              <p className="mt-0.5 text-xl font-bold text-gray-900">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Low / Out of Stock
              </p>
              <p className="mt-0.5 text-xl font-bold text-gray-900">
                {lowStockCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadProducts(true)}
            disabled={refreshing}
            className="self-start font-semibold text-red-700 underline-offset-2 hover:underline sm:self-auto"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product name or ID..."
              aria-label="Search products"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="relative">
            <Filter
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              aria-label="Filter by category"
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-9 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="All">All Categories</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            aria-label="Filter by product status"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800"
            >
              <X size={14} />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
            <Package size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No products yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Start building your store catalogue by adding your first product.
          </p>

          <Link
            to="/admin/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
            <Search size={22} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-gray-900">
            No matching products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>

            {refreshing && (
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <RefreshCw size={13} className="animate-spin" />
                Refreshing...
              </span>
            )}
          </div>

          {/* Desktop Product Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200 bg-gray-50/80">
                  <tr>
                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className={`whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                          heading === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-[220px] items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                  <Package size={19} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-semibold text-gray-900">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                ID: #{product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex whitespace-nowrap rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {hasDiscount(product) ? (
                            <div className="space-y-1">
                              <p className="whitespace-nowrap text-sm font-bold text-green-700">
                                {formatCurrency(product.discountedPrice!)}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(product.price)}
                                </span>
                                <span className="text-xs font-semibold text-green-700">
                                  {getDiscountPercentage(product)}% off
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-gray-800">
                              {product.stock} units
                            </p>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${stockStatus.classes}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${stockStatus.dot}`}
                              />
                              {stockStatus.label}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              product.active
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.active ? "bg-green-600" : "bg-gray-400"
                              }`}
                            />
                            {product.active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                              <Edit size={15} />
                              Edit
                            </Link>

                            {product.active ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedAction({
                                    product,
                                    action: "deactivate",
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                              >
                                <PowerOff size={15} />
                                Deactivate
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedAction({
                                    product,
                                    action: "activate",
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                              >
                                <Power size={15} />
                                Activate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Product Cards */}
          <div className="space-y-3 md:hidden">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Package size={25} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="break-words text-sm font-semibold leading-5 text-gray-900">
                              {product.name}
                            </h2>
                            <p className="mt-1 text-xs text-gray-400">
                              Product #{product.id}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              product.active
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="mt-2 text-xs font-medium text-green-700">
                          {product.category}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                          {hasDiscount(product) ? (
                            <>
                              <span className="text-sm font-bold text-green-700">
                                {formatCurrency(product.discountedPrice!)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-[11px] font-semibold text-green-700">
                                {getDiscountPercentage(product)}% off
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          Available stock
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {product.stock} units
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${stockStatus.classes}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${stockStatus.dot}`}
                        />
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex border-t border-gray-100 bg-gray-50/70 p-3">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>

                    <div className="w-2" />

                    {product.active ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAction({
                            product,
                            action: "deactivate",
                          })
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <PowerOff size={16} />
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAction({
                            product,
                            action: "activate",
                          })
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                      >
                        <Power size={16} />
                        Activate
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Activation / Deactivation Confirmation */}
      {selectedAction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !actionLoading) {
              setSelectedAction(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-action-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                selectedAction.action === "deactivate"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {selectedAction.action === "deactivate" ? (
                <PowerOff size={22} />
              ) : (
                <Power size={22} />
              )}
            </div>

            <h2
              id="product-action-title"
              className="mt-5 text-lg font-bold text-gray-900"
            >
              {selectedAction.action === "deactivate"
                ? "Deactivate product?"
                : "Activate product?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {selectedAction.action === "deactivate"
                ? `Are you sure you want to deactivate "${selectedAction.product.name}"? Customers may no longer be able to purchase this product.`
                : `Are you sure you want to activate "${selectedAction.product.name}"?`}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setSelectedAction(null)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void handleProductAction()}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  selectedAction.action === "deactivate"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-700 hover:bg-green-800"
                }`}
              >
                {actionLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Please wait...
                  </>
                ) : selectedAction.action === "deactivate" ? (
                  <>
                    <PowerOff size={16} />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power size={16} />
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminProductsPage };
