import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100">
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="w-64 border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              Admin Panel
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Haksan Naturals
            </p>
          </div>

          <nav className="space-y-1 p-4">
            <Link
              to="/admin"
              className={`block rounded-md px-4 py-3 text-sm font-medium ${
                isActive("/admin")
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/admin/products"
              className={`block rounded-md px-4 py-3 text-sm font-medium ${
                isActive("/admin/products")
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Products
            </Link>

            <Link
              to="/admin/orders"
              className={`block rounded-md px-4 py-3 text-sm font-medium ${
                isActive("/admin/orders")
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Orders
            </Link>
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-md px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };