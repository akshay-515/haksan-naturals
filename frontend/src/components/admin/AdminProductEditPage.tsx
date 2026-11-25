
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Package,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAdminProducts,
  updateProduct,
  uploadProductImage,
} from "../../api/adminProductApi";
import type { AdminProductRequest } from "../../types/adminProduct";
import { PRODUCT_CATEGORIES } from "../../types/constants/productCategories";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const AdminProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminProductRequest>({
    name: "",
    description: "",
    price: 0,
    discountedPrice: undefined,
    imageUrl: "",
    category: "",
    stock: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : null;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId || !Number.isInteger(Number(productId))) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        setError("");

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
          discountedPrice: product.discountedPrice ?? undefined,
          imageUrl: product.imageUrl ?? "",
          category: PRODUCT_CATEGORIES.some(
            (category) => category === product.category
          )
            ? product.category
            : "",
          stock: product.stock,
        });
      } catch {
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : name === "discountedPrice"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Please select a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImageError("");

    const input = document.getElementById(
      "image"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productId) {
      setError("Invalid product ID.");
      return;
    }

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category) {
      setError("Please select a supported product category.");
      return;
    }

    if (!Number.isFinite(form.price) || form.price <= 0) {
      setError("Regular price must be greater than zero.");
      return;
    }

    if (!Number.isInteger(form.stock) || form.stock < 0) {
      setError("Stock must be a valid non-negative whole number.");
      return;
    }

    if (
      form.discountedPrice != null &&
      (form.discountedPrice <= 0 ||
        form.discountedPrice >= form.price)
    ) {
      setError("Discounted price must be greater than zero and lower than the regular price.");
      return;
    }

    if (imageError) {
      setError("Please resolve the image selection error before saving.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = form.imageUrl;

      if (selectedFile) {
        const imageResponse = await uploadProductImage(selectedFile);
        imageUrl = imageResponse.imageUrl;
      }

      await updateProduct(Number(productId), {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl,
      });

      navigate("/admin/products");
    } catch {
      setError("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[550px] animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
          <div className="h-[350px] animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage =
    form.discountedPrice != null &&
    form.discountedPrice > 0 &&
    form.discountedPrice < form.price
      ? Math.round(
          ((form.price - form.discountedPrice) / form.price) * 100
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Edit Product
          </h1>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            #{productId}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Update product information, pricing, inventory and images.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 rounded-md p-1 hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Main Product Information */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Edit the basic details displayed to customers.
                </p>
              </div>

              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="Enter product name"
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
                  placeholder="Describe the product, its benefits and uses..."
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Keep the description clear and useful for customers.
                </p>
              </div>

              {/* Pricing and Stock */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Regular Price <span className="text-red-500">*</span>
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
                    htmlFor="discountedPrice"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Discounted Price
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                      ₹
                    </span>

                    <input
                      id="discountedPrice"
                      name="discountedPrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={form.price > 0 ? form.price - 0.01 : undefined}
                      value={form.discountedPrice ?? ""}
                      onChange={handleChange}
                      placeholder="No discount"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Must be lower than the regular price.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Discount Preview */}
              {discountPercentage > 0 && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Discount Preview
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="text-xl font-bold text-green-800">
                      ₹{form.discountedPrice?.toFixed(2)}
                    </span>

                    <span className="text-sm text-gray-500 line-through">
                      ₹{form.price.toFixed(2)}
                    </span>

                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="mt-6">
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="" disabled>
                    Select a category
                  </option>

                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {!form.category && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs leading-5 text-amber-800">
                      This product has an older or unsupported category.
                      Select one of the supported categories before saving.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Image and Save Panel */}
          <div className="space-y-6">
            {/* Product Image */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Image
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Replace the existing image whenever needed.
                </p>
              </div>

              {/* Image Preview */}
              {(previewUrl || form.imageUrl) ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <div className="aspect-square">
                    <img
                      src={previewUrl || form.imageUrl}
                      alt={form.name || "Product preview"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                  <ImagePlus size={40} strokeWidth={1.5} />
                  <p className="mt-3 text-sm font-medium">
                    No product image
                  </p>
                </div>
              )}

              {/* Image Status */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                {selectedFile ? (
                  <span className="flex items-center gap-1.5 font-medium text-green-700">
                    <Check size={15} />
                    New image selected
                  </span>
                ) : form.imageUrl ? (
                  <span className="flex items-center gap-1.5 font-medium text-green-700">
                    <Check size={15} />
                    Current product image
                  </span>
                ) : (
                  <span className="text-gray-500">
                    No image uploaded
                  </span>
                )}
              </div>

              {/* Selected File Details */}
              {selectedFile && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <Package size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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

                  <p className="mt-3 text-xs leading-5 text-green-700">
                    This image will replace the current image when you save.
                  </p>
                </div>
              )}

              {/* Image Error */}
              {imageError && (
                <p className="mt-3 text-xs font-medium text-red-600">
                  {imageError}
                </p>
              )}

              {/* Upload Controls */}
              <div className="mt-4">
                <label
                  htmlFor="image"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-700 transition hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                >
                  {selectedFile ? (
                    <>
                      <Upload size={17} />
                      Choose Different Image
                    </>
                  ) : (
                    <>
                      <ImagePlus size={18} />
                      Replace Image
                    </>
                  )}

                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Supported formats: JPG, PNG and WebP. Maximum size: 5 MB.
                Leave unchanged to keep the current image.
              </p>
            </section>

            {/* Save Changes */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Save Changes
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Review your changes before updating this product.
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
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};

export { AdminProductEditPage };
