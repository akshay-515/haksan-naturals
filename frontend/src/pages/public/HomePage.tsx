import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { getProducts } from "../../api/ProductApi";
import type { Product } from "../../types/product";
import { ProductCard } from "../../components/product/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4));
      } catch {
        // Homepage should still render if products fail to load.
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* Hero Content */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <img
                src="src/assets/haksan-logo-mark.png"
                alt="Haksan Naturals"
                className="h-14 w-14 object-contain"
              />

              <div>
                <p className="text-lg font-bold text-green-900">
                  Haksan Naturals
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-green-700">
                  Pure Goodness, Naturally
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Natural nutrition
            </p>

            <h1 className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
              Nature's goodness,
              <span className="block text-green-700">
                made simple.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Discover carefully selected fruit, vegetable, leaf and spice
              powders made for simple, everyday nutrition.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Shop Products
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full border border-green-200 bg-white px-6 py-3.5 text-sm font-semibold text-green-800 transition hover:border-green-400 hover:bg-green-50"
              >
                Explore our range
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-3xl bg-green-100 p-8 shadow-sm sm:p-12">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-200/50" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-green-200/60" />

              <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-white/70 p-8 shadow-sm backdrop-blur">
                <img
                  src="src/assets/haksan-logo.jpeg"
                  alt="Haksan Naturals"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Shop by category
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Find the right natural powder for your everyday needs.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">

          <Link
            to="/products"
            className="group rounded-2xl border border-green-100 bg-green-50 p-5 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md sm:p-6"
          >
            <Leaf
              className="text-green-700"
              size={28}
              strokeWidth={1.7}
            />

            <h3 className="mt-5 font-semibold text-gray-900">
              Fruit Powders
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Naturally sourced fruit goodness.
            </p>
          </Link>

          <Link
            to="/products"
            className="group rounded-2xl border border-green-100 bg-white p-5 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md sm:p-6"
          >
            <Sparkles
              className="text-green-700"
              size={28}
              strokeWidth={1.7}
            />

            <h3 className="mt-5 font-semibold text-gray-900">
              Vegetable Powders
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Simple goodness from vegetables.
            </p>
          </Link>

          <Link
            to="/products"
            className="group rounded-2xl border border-green-100 bg-green-50 p-5 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md sm:p-6"
          >
            <Leaf
              className="text-green-700"
              size={28}
              strokeWidth={1.7}
            />

            <h3 className="mt-5 font-semibold text-gray-900">
              Leaf Powders
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Dried leaves, finely powdered.
            </p>
          </Link>

          <Link
            to="/products"
            className="group rounded-2xl border border-green-100 bg-white p-5 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md sm:p-6"
          >
            <Sparkles
              className="text-green-700"
              size={28}
              strokeWidth={1.7}
            />

            <h3 className="mt-5 font-semibold text-gray-900">
              Spice Powders
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Everyday spices in powder form.
            </p>
          </Link>
        </div>
      </section>

      {/* Why Haksan */}
      <section className="bg-green-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-300">
              Why Haksan Naturals
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple products.
              <span className="block text-green-300">
                Natural inspiration.
              </span>
            </h2>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">

            <div>
              <Leaf
                size={30}
                className="text-green-300"
                strokeWidth={1.7}
              />

              <h3 className="mt-4 text-lg font-semibold">
                Natural ingredients
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-100/75">
                Products centered around familiar fruits, vegetables,
                leaves and spices.
              </p>
            </div>

            <div>
              <ShieldCheck
                size={30}
                className="text-green-300"
                strokeWidth={1.7}
              />

              <h3 className="mt-4 text-lg font-semibold">
                Quality focused
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-100/75">
                A simple product experience built around quality and
                transparency.
              </p>
            </div>

            <div>
              <Sparkles
                size={30}
                className="text-green-300"
                strokeWidth={1.7}
              />

              <h3 className="mt-4 text-lg font-semibold">
                Made for everyday use
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-100/75">
                Easy-to-use powders designed to fit naturally into
                everyday routines.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                Our collection
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Featured products
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Explore some of our natural powder collection.
              </p>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-1 text-sm font-semibold text-green-700 transition hover:text-green-800 sm:flex"
            >
              View all
              <ArrowRight size={17} />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-[0.85] animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
              <p className="text-gray-600">
                Products will appear here soon.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-700"
            >
              View all products
              <ArrowRight size={17} />
            </Link>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to explore?
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Browse our collection of natural fruit, vegetable, leaf and
          spice powders.
        </p>

        <Link
          to="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-green-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          Shop all products
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
};

export { HomePage };