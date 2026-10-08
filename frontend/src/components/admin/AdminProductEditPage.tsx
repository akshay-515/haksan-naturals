import { useEffect, useState } from "react";
import {
  Check,
  ImagePlus,
  Package,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminProducts,
  updateProduct,
  uploadProductImage,
} from "../../api/adminProductApi";
import type { AdminProductRequest } from "../../types/adminProduct";

const AdminProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminProductRequest>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
    stock: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const products = await getAdminProducts();

        const product = products.find(
          (item) => item.id === Number(productId)
        );

        if (!product) {
          setError("Product not found.");
          return;
        }

        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl ?? "",
          category: product.category,
          stock: product.stock,
        });
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

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

    if (!productId) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      let imageUrl = form.imageUrl;

      if (selectedFile) {
        const imageResponse = await uploadProductImage(selectedFile);
        imageUrl = imageResponse.imageUrl;
      }

      await updateProduct(Number(productId), {
        ...form,
        imageUrl,
      });

      navigate("/admin/products");
    } catch {
      setError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-4 w-52 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[500px] animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
          <div className="h-[300px] animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mt-6 inline-flex items-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit Product
          </h1>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            #{productId}
          </span>
        </div>

        <p className="mt-2 text-gray-600">
          Update the product information and save your changes.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
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
                  Update the basic details of this product.
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Keep the description clear and useful for customers.
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </div>

          {/* Image + Save */}
          <div className="space-y-6">
            {/* Current Image */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Image
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Replace the current product image if needed.
                </p>
              </div>

              {/* Current image */}
              {form.imageUrl && !selectedFile && (
                <div>
                  <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={form.imageUrl}
                      alt={form.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                    <Check size={15} />
                    Current product image
                  </div>
                </div>
              )}

              {/* New image selected */}
              {selectedFile && (
                <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4">
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

                  <p className="mt-3 text-xs font-medium text-green-700">
                    This image will replace the current image when
                    you save.
                  </p>
                </div>
              )}

              {/* Upload button */}
              {!selectedFile && (
                <label
                  htmlFor="image"
                  className="group mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-700 transition hover:border-green-400 hover:bg-green-50/40 hover:text-green-700"
                >
                  <ImagePlus size={19} />
                  Replace Image

                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {selectedFile && (
                <label
                  htmlFor="image"
                  className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Upload size={17} />
                  Choose Different Image

                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Supported formats: JPG, PNG and WebP.
              </p>
            </div>

            {/* Save */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Save Changes
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Your changes will be saved to the product immediately.
              </p>

              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  disabled={saving}
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

export { AdminProductEditPage };