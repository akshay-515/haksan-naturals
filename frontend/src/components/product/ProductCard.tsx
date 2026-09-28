import { Link } from "react-router-dom";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {product.name}
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        {product.description}
      </p>

      <p className="mt-4 text-lg font-bold text-green-700">
        ₹{product.price}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Stock: {product.stock}
      </p>
    </Link>
  );
};

export { ProductCard };