import { Link } from "react-router-dom";
import { Leaf, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-green-900/10 bg-green-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="src/assets/haksan-logo-mark.png"
                alt="Haksan Naturals"
                className="h-12 w-12 object-contain"
              />

              <div>
                <p className="text-lg font-bold">
                  Haksan Naturals
                </p>

                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-green-300">
                  Pure Goodness, Naturally
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-green-100/70">
              Natural fruit, vegetable, leaf and spice powders
              made for simple, everyday nutrition.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-green-100/70">
              <Leaf size={17} className="text-green-300" />
              Naturally inspired products.
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Shop
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="/products"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                All Products
              </Link>

              <Link
                to="/products"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Fruit Powders
              </Link>

              <Link
                to="/products"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Vegetable Powders
              </Link>

              <Link
                to="/products"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Leaf Powders
              </Link>
            </nav>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-300">
              Customer
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/cart"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Cart
              </Link>

              <Link
                to="/orders"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                My Orders
              </Link>

              <Link
                to="/addresses"
                className="text-sm text-green-100/70 transition hover:text-white"
              >
                Addresses
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-green-100/50">
            © {new Date().getFullYear()} Haksan Naturals. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-green-100/50">
            <Mail size={14} />
            Natural goodness, delivered.
          </div>

        </div>
      </div>
    </footer>
  );
};

export { Footer };