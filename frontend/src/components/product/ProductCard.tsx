import { Link } from "react-router-dom";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {

  const hasDiscount =
    product.discountedPrice != null &&
    product.discountedPrice > 0 &&
    product.discountedPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountedPrice!) / product.price) * 100
      )
    : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4">
        <p className="text-xs font-medium text-green-700 sm:text-sm">
          {product.category}
        </p>

        <h3 className="mt-1 text-sm font-semibold leading-5 text-gray-900 sm:text-lg sm:leading-6">
          {product.name}
        </h3>

        {/* Description only on larger screens */}
        <p className="mt-2 hidden text-sm leading-5 text-gray-600 sm:line-clamp-2 sm:block">
          {product.description}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2 sm:mt-4">
          <div className="min-w-0">
            {hasDiscount ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-bold text-green-700 sm:text-lg">
                    ₹{product.discountedPrice!.toFixed(2)}
                  </p>

                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 sm:text-xs">
                    {discountPercentage}% OFF
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500 line-through sm:text-sm">
                  ₹{product.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-base font-bold text-green-700 sm:text-lg">
                ₹{product.price.toFixed(2)}
              </p>
            )}
          </div>

          <p
            className={`hidden shrink-0 text-xs font-medium sm:block ${
              product.stock > 0 ? "text-gray-500" : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export { ProductCard };