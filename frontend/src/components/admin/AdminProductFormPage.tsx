
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Package,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  createProduct,
  uploadProductImage,
} from "../../api/adminProductApi";
import type { AdminProductRequest } from "../../types/adminProduct";
import { PRODUCT_CATEGORIES } from "../../types/constants/productCategories";

const MAX_IMAGE_SIZE_MB = 5;

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!selectedFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "price" || name === "stock"
          ? value === "" ? 0 : Number(value)
          : name === "discountedPrice"
            ? value === "" ? undefined : Number(value)
            : value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setFieldErrors((current) => ({
        ...current,
        image: "Please select a JPG, PNG or WebP image.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setFieldErrors((current) => ({
        ...current,
        image: `Image size must be ${MAX_IMAGE_SIZE_MB} MB or less.`,
      }));
      event.target.value = "";
      return;
    }

    setFieldErrors((current) => ({
      ...current,
      image: "",
    }));

    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    const input = document.getElementById(
      "image"
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Product name is required.";
    }

    if (!form.description.trim()) {
      errors.description = "Product description is required.";
    }

    if (form.price <= 0 || !Number.isFinite(form.price)) {
      errors.price = "Enter a valid price greater than zero.";
    }

    if (!Number.isInteger(form.stock) || form.stock < 0) {
      errors.stock = "Stock must be a non-negative whole number.";
    }

    if (!form.category) {
      errors.category = "Please select a category.";
    }

    if (
      form.discountedPrice !== undefined &&
      (!Number.isFinite(form.discountedPrice) ||
        form.discountedPrice <= 0 ||
        form.discountedPrice >= form.price)
    ) {
      errors.discountedPrice =
        "Discounted price must be greater than zero and lower than the original price.";
    }

    if (!selectedFile) {
      errors.image = "Please select a product image.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    if (loading || !selectedFile) return;

    setLoading(true);

    try {
      const imageResponse = await uploadProductImage(selectedFile);

      await createProduct({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: imageResponse.imageUrl,
      });

      navigate("/admin/products");
    } catch {
      setError(
        "Unable to create the product. Please check the information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const discountIsValid =
    form.discountedPrice !== undefined &&
    form.discountedPrice > 0 &&
    form.discountedPrice < form.price &&
    form.price > 0;

  const discountPercentage = discountIsValid
    ? Math.round(
        ((form.price - form.discountedPrice!) / form.price) * 100
      )
    : 0;

  const inputClasses =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

  const getInputClasses = (field: string) =>
    `${inputClasses} ${
      fieldErrors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Add Product
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Add a new product to your Haksan Naturals store.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <Package size={14} />
            New Product
          </span>
        </div>
      </div>

      {/* General Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Product Information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the details customers will see in your store.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Amla Powder"
                    className={getInputClasses("name")}
                    aria-invalid={!!fieldErrors.name}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the product, its uses and other relevant information..."
                    className={`${getInputClasses("description")} resize-y leading-6`}
                    aria-invalid={!!fieldErrors.description}
                  />
                  {fieldErrors.description && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Write a clear description to help customers understand the product.
                  </p>
                </div>

                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={getInputClasses("category")}
                    aria-invalid={!!fieldErrors.category}
                  >
                    <option value="">Select a category</option>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.category}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Pricing and Inventory */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pricing and Inventory
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Set the selling price and available quantity.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700">
                    Original Price <span className="text-red-500">*</span>
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
                      value={form.price || ""}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`${getInputClasses("price")} pl-9`}
                      aria-invalid={!!fieldErrors.price}
                    />
                  </div>
                  {fieldErrors.price && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="discountedPrice" className="mb-2 block text-sm font-medium text-gray-700">
                    Discounted Price
                    <span className="ml-1 font-normal text-gray-400">(Optional)</span>
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
                      className={`${getInputClasses("discountedPrice")} pl-9`}
                      aria-invalid={!!fieldErrors.discountedPrice}
                    />
                  </div>
                  {fieldErrors.discountedPrice ? (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.discountedPrice}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-gray-400">
                      Must be lower than the original price.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="stock" className="mb-2 block text-sm font-medium text-gray-700">
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
                    className={getInputClasses("stock")}
                    aria-invalid={!!fieldErrors.stock}
                  />
                  {fieldErrors.stock && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.stock}</p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-400">
                    Enter the number of units available.
                  </p>
                </div>
              </div>

              {discountIsValid && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                    <CheckCircle2 size={15} />
                    Discount Preview
                  </div>
                  <div className="mt-3 flex flex-wrap items-baseline gap-3">
                    <span className="text-xl font-bold text-green-800">
                      ₹{form.discountedPrice!.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{form.price.toFixed(2)}
                    </span>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-green-700">
                    Customer saves ₹
                    {(form.price - form.discountedPrice!).toFixed(2)} per item.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Image and Publish */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Image
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a clear image of your product.
                </p>
              </div>

              {imagePreview ? (
                <div>
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Selected product preview"
                      className="aspect-square w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      disabled={loading}
                      aria-label="Remove selected image"
                      className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-600 shadow-md transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" />
                    <div className="min-w-0">
                      <p className="break-all text-xs font-medium text-gray-700">
                        {selectedFile?.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {((selectedFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center transition hover:border-green-500 hover:bg-green-50/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 transition group-hover:bg-green-200">
                    <ImagePlus size={27} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-gray-800">
                    Click to upload image
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WebP
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                    <Upload size={14} />
                    Choose Image
                  </span>
                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {fieldErrors.image && (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  {fieldErrors.image}
                </p>
              )}

              <p className="mt-4 text-xs leading-5 text-gray-400">
                Supported formats: JPG, PNG and WebP. Maximum file size: {MAX_IMAGE_SIZE_MB} MB.
              </p>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Publish Product
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Check the details before adding this product to your catalogue.
              </p>

              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Package size={17} />
                      Create Product
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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

export { AdminProductFormPage };
