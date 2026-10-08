import { useState } from "react";
import { ImagePlus, Package, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  uploadProductImage,
} from "../../api/adminProductApi";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    const input = document.getElementById(
      "image"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (!selectedFile) {
        setError("Please select a product image.");
        return;
      }

      const imageResponse = await uploadProductImage(selectedFile);

      await createProduct({
        ...form,
        imageUrl: imageResponse.imageUrl,
      });

      navigate("/admin/products");
    } catch {
      setError("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Add Product
        </h1>

        <p className="mt-2 text-gray-600">
          Add a new product to your Haksan Naturals store.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Information */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the basic information about this product.
                </p>
              </div>

              {/* Name */}
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
                  placeholder="e.g. Amla Powder"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Description */}
              <div className="mt-6">
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
                  rows={6}
                  placeholder="Describe the product, its uses, benefits, and other relevant information..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Give customers a clear and useful description of
                  the product.
                </p>
              </div>

              {/* Price + Stock */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                      ₹
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Stock Quantity
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mt-6">
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
                  placeholder="e.g. Fruit Powders"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Example: Fruit Powders, Vegetable Powders, Leaf
                  Powders, Spice Powders.
                </p>
              </div>
            </div>
          </div>

          {/* Image + Actions */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Image
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload an image for your product.
                </p>
              </div>

              {!selectedFile ? (
                <label
                  htmlFor="image"
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center transition hover:border-green-400 hover:bg-green-50/40"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700 transition group-hover:bg-green-100">
                    <ImagePlus size={26} strokeWidth={1.8} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-gray-800">
                    Click to upload image
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    JPG, PNG or WebP
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm">
                    <Upload size={14} />
                    Choose File
                  </span>

                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <Package size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove selected image"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Use a clear product image with good lighting and a
                simple background.
              </p>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Publish Product
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Review the information before creating the product.
              </p>

              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Product..." : "Create Product"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export { AdminProductFormPage };