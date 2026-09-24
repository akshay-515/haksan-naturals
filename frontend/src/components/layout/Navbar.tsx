import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-green-700">
          Haksan Naturals
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-green-700"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 hover:text-green-700"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-1 text-gray-700 hover:text-green-700"
          >
            <ShoppingCart size={20} />
            <span className="text-sm font-medium">Cart</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-1 text-gray-700 hover:text-green-700"
          >
            <User size={20} />
            <span className="text-sm font-medium">Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export { Navbar };