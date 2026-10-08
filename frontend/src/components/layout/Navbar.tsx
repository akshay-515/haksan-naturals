import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-green-700"
        : "text-gray-700 hover:text-green-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <img
            src="/src/assets/haksan-logo-mark.png"
            alt="Haksan Naturals"
            className="h-12 w-12 object-contain"
          />

          <div className="hidden sm:block">
            <p className="text-lg font-bold leading-tight tracking-tight text-green-900">
              Haksan Naturals
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-green-700">
              Pure Goodness, Naturally
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">

          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-green-700"
                  : "text-gray-700 hover:text-green-700"
              }`
            }
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            Cart
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
        </nav>

        {/* Desktop Account */}
        <div className="hidden items-center gap-3 md:flex">

          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:text-green-700"
              >
                <User size={17} strokeWidth={1.8} />
                Account
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-full px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <User size={17} strokeWidth={1.8} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">

            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMobileMenu}
              className={`${navLinkClass} py-3`}
            >
              Shop
            </NavLink>

            <NavLink
              to="/cart"
              onClick={closeMobileMenu}
              className={`${navLinkClass} flex items-center gap-2 py-3`}
            >
              <ShoppingBag size={18} />
              Cart
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/orders"
                  onClick={closeMobileMenu}
                  className={`${navLinkClass} py-3`}
                >
                  My Orders
                </NavLink>

                <NavLink
                  to="/account"
                  onClick={closeMobileMenu}
                  className={`${navLinkClass} flex items-center gap-2 py-3`}
                >
                  <User size={18} />
                  Account
                </NavLink>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="py-3 text-left text-sm font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="mt-3 rounded-lg bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export { Navbar };