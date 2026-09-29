import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts, deactivateProduct, activateProduct } from "../../api/adminProductApi";
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

  if (loading) {
    return <p className="text-gray-600">Loading products...</p>;
  }

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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your store products.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          Add Product
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">
            No products found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        )}

                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            #{product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.category}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{product.price}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Edit
                        </Link>

                        {product.active ? (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleActivate(product.id)}
                            className="text-green-600 hover:text-green-800"
                          >
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
      )}
    </div>
  );
};

export { AdminProductsPage };