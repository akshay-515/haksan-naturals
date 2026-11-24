
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../../api/ProductApi";
import type { Product } from "../../types/product";
import { ProductCard } from "../../components/product/ProductCard";
import { PRODUCT_CATEGORIES } from "../../types/constants/productCategories";

const getValidCategory = (category: string | null): string => {
  return (
    PRODUCT_CATEGORIES.find((item) => item === category) || "All"
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => getValidCategory(searchParams.get("category"))
  );

  // Keep the selected category synchronized with the URL.
  useEffect(() => {
    const categoryFromUrl = getValidCategory(
      searchParams.get("category")
    );

    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  // Load products from the backend.
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Only show the four approved customer-facing categories.
  const categories = ["All", ...PRODUCT_CATEGORIES];

  // Update the selected category and URL.
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    const updatedParams = new URLSearchParams(searchParams);

    if (category === "All") {
      updatedParams.delete("category");
    } else {
      updatedParams.set("category", category);
    }

    setSearchParams(updatedParams);
  };

  // Filter products by search term and category.
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Loading state.
  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-gray-600">Loading products...</p>
      </main>
    );
  }

  // Error state.
  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Page heading */}
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Our Products
      </h2>

      {/* Search and Category Filter */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 sm:flex-1"
        />

        <select
          value={selectedCategory}
          onChange={(event) =>
            handleCategoryChange(event.target.value)
          }
          className="rounded-md border border-gray-300 bg-white px-4 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Product Listing */}
      {filteredProducts.length === 0 ? (
        <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <p className="text-gray-600">
            No products found.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export { ProductsPage };
