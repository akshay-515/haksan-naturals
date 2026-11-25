
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Menu,
  Package,
  ShoppingCart,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import logoMark from "../../assets/haksan-logo-mark.png";

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate("/admin/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile navigation whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile navigation using the Escape key.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const navigation = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
  ];

  const NavigationLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      aria-label="Admin navigation"
      className="space-y-1.5"
    >
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={mobile ? closeMobileMenu : undefined}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-green-50 text-green-800 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-green-800"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon
                size={19}
                strokeWidth={active ? 2.2 : 1.8}
                className={
                  active
                    ? "text-green-700"
                    : "text-gray-400 transition group-hover:text-green-700"
                }
              />

              {item.label}
            </span>

            {active && (
              <ChevronRight
                size={16}
                className="text-green-700"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-[68px] items-center justify-between border-b border-gray-200/80 bg-white px-4 shadow-sm lg:hidden">

        <Link
          to="/admin"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5"
        >
          <img
            src={logoMark}
            alt="Haksan Naturals"
            className="h-10 w-10 object-contain"
          />

          <div>
            <p className="text-sm font-bold leading-tight text-green-950">
              Haksan Naturals
            </p>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-green-700">
              Admin Panel
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
            mobileMenuOpen
              ? "bg-green-50 text-green-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-label={
            mobileMenuOpen
              ? "Close admin navigation"
              : "Open admin navigation"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-admin-navigation"
        >
          {mobileMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-68px)] lg:min-h-screen">

        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">

          {/* Brand */}
          <div className="border-b border-gray-100 px-6 py-6">
            <Link
              to="/admin"
              className="flex items-center gap-3"
            >
              <img
                src={logoMark}
                alt="Haksan Naturals"
                className="h-11 w-11 object-contain"
              />

              <div>
                <p className="font-bold text-green-950">
                  Haksan Naturals
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green-700">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-7">
            <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Main Menu
            </p>

            <NavigationLinks />
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-100 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>

            <p className="mt-4 px-4 text-[10px] text-gray-400">
              Haksan Naturals · Admin
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Background Overlay */}
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMobileMenu}
              className="fixed inset-x-0 bottom-0 top-[68px] z-40 bg-gray-950/40 backdrop-blur-[2px] lg:hidden"
            />

            {/* Navigation Panel */}
            <div
              id="mobile-admin-navigation"
              className="fixed bottom-0 left-0 top-[68px] z-40 flex w-[min(82%,320px)] flex-col border-r border-gray-200 bg-white shadow-2xl lg:hidden"
            >
              <div className="border-b border-gray-100 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Navigation
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  Manage your store
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <NavigationLinks mobile />
              </div>

              <div className="border-t border-gray-100 p-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };
