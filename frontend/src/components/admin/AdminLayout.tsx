import { useState } from "react";
import {
  LayoutDashboard,
  Menu,
  Package,
  ShoppingCart,
  X,
  LogOut,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <Link
          to="/admin"
          className="flex items-center gap-2"
          onClick={closeMobileMenu}
        >
          <img
            src="src/assets/haksan-logo-mark.png"
            alt="Haksan Naturals"
            className="h-9 w-9 object-contain"
          />

          <div>
            <p className="text-sm font-bold text-green-900">
              Haksan Naturals
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wider text-green-700">
              Admin
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
          aria-label="Toggle admin navigation"
        >
          {mobileMenuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </header>

      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">

          {/* Brand */}
          <div className="border-b border-gray-200 px-6 py-5">
            <Link
              to="/admin"
              className="flex items-center gap-3"
            >
              <img
                src="src/assets/haksan-logo-mark.png"
                alt="Haksan Naturals"
                className="h-11 w-11 object-contain"
              />

              <div>
                <p className="font-bold text-green-900">
                  Haksan Naturals
                </p>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-green-700">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.2 : 1.8}
                  />

                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-30 bg-white lg:hidden">
            <nav className="space-y-1 border-b border-gray-200 p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                      active
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={19} />
                    {item.label}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };