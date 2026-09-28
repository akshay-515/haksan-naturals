import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/adminProductApi";
import type { AdminProductRequest } from "../../types/adminProduct";

const AdminProductFormPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminProductRequest>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
    stock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createProduct(form);
      navigate("/admin/products");
    } catch {
      setError("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Add Product
        </h1>

        <p className="mt-2 text-gray-600">
          Add a new product to your store.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            value={form.category}
            onChange={handleChange}
            required
            placeholder="Fruit Powder"
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>

          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            required
            placeholder="https://..."
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />

          <p className="mt-2 text-xs text-gray-500">
            Image upload will be integrated later.
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export { AdminProductFormPage };