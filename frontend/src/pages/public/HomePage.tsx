
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getProducts } from "../../api/ProductApi";
import type { Product } from "../../types/product";
import { ProductCard } from "../../components/product/ProductCard";
import { PRODUCT_CATEGORIES } from "../../types/constants/productCategories";

import fruitImage from "../../assets/fruit-powders.jpg";
import vegetableImage from "../../assets/vegetable-powders.jpg";
import dryFruitsImage from "../../assets/dry-fruits.jpg";
import oilsImage from "../../assets/natural-oils.jpg";
import heroImage from "../../assets/hero.png";

const categoryImages: Record<string, string> = {
  "Fruit Powders": fruitImage,
  "Vegetable Powders": vegetableImage,
  "Dry Fruits": dryFruitsImage,
  "Natural Oils": oilsImage,
};

const categoryDescriptions: Record<string, string> = {
  "Fruit Powders": "Fruit goodness in convenient powdered form.",
  "Vegetable Powders": "Explore powders made from vegetables.",
  "Dry Fruits": "A selection of naturally delicious dry fruits.",
  "Natural Oils": "Explore our range of natural oils.",
};

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4));
      } catch {
        // Keep the homepage usable if products cannot be loaded.
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-br from-[#f4f6e9] via-[#fbfaf4] to-[#edf3e7]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          {/* Hero content */}
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-800 sm:text-sm">
              Pure goodness, naturally
            </p>

            <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
              Nature's goodness,
              <span className="block text-green-700">
                made simple.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-700 sm:text-lg">
              Discover fruit powders, vegetable powders, dry fruits
              and natural oils for your everyday needs.
            </p>

            <div className="mt-7">
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-green-800 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900"
              >
                Shop now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Hero Product Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={heroImage}
                alt="Haksan Naturals fruit powders, vegetable powders, dry fruits and natural oils"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:text-sm">
            Explore our range
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Shop by category
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            Explore our four natural product categories.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {PRODUCT_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="overflow-hidden">
                <img
                  src={categoryImages[category]}
                  alt={category}
                  loading="lazy"
                  className="aspect-[1.15/1] w-full object-cover transition duration-500 group-hover:scale-105 sm:aspect-[1.1/1]"
                />
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                    {category}
                  </h3>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-800 transition group-hover:bg-green-800 group-hover:text-white">
                    <ArrowRight size={15} />
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                  {categoryDescriptions[category]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#f8f9f5]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:text-sm">
                Our selection
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Featured products
              </h2>

              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Explore products from our natural range.
              </p>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-green-800 transition hover:text-green-950 sm:inline-flex"
            >
              View all
              <ArrowRight size={17} />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-[0.85] animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
              <p className="text-sm text-gray-600">
                Products will appear here soon.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-800"
            >
              View all products
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Haksan Naturals */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl bg-[#f0f4e9] px-5 py-8 sm:px-8 sm:py-10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:text-sm">
              Why Haksan Naturals
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-green-950 sm:text-3xl">
              Simple products. Natural inspiration.
            </h2>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            <div className="text-center">
              <Leaf
                size={32}
                className="mx-auto text-green-800"
                strokeWidth={1.7}
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                Natural ingredients
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Products centered around familiar natural ingredients.
              </p>
            </div>

            <div className="text-center">
              <ShieldCheck
                size={32}
                className="mx-auto text-green-800"
                strokeWidth={1.7}
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                Quality focused
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                A product experience built around quality and transparency.
              </p>
            </div>

            <div className="text-center">
              <Sparkles
                size={32}
                className="mx-auto text-green-800"
                strokeWidth={1.7}
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                Made for everyday use
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Products designed to fit into everyday routines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export { HomePage };
