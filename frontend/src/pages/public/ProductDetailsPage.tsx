import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../api/ProductApi";
import { useAuth } from "../../context/AuthContext";
import { addToCart } from "../../api/cartApi";
import type { Product } from "../../types/product";

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(Number(productId));

        setProduct(data);
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
      return (
        <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-gray-600">Loading product...</p>
        </main>
      );
    }

    if (error || !product) {
      return (
        <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-red-600">
            {error || "Product not found."}
        </p>
        </main>
      );
    }

    const handleAddToCart = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      setAddingToCart(true);
      setCartMessage("");
      setCartError("");

      try {
        await addToCart({
          productId: product.id,
          quantity,
        });

        setCartMessage("Product added to cart.");
      } catch {
        setCartError("Failed to add product to cart.");
      } finally {
        setAddingToCart(false);
      }
    };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-green-700">
            {product.category}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {product.name}
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            {product.description}
          </p>

          <p className="mt-6 text-2xl font-bold text-green-700">
            ₹{product.price}
          </p>

          <p
            className={`mt-2 text-sm font-medium ${
              product.stock > 0
                ? "text-gray-500"
                : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700"
              >
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(event) => {
                  const value = Number(event.target.value);

                  if (value >= 1 && value <= product.stock) {
                    setQuantity(value);
                  }
                }}
                className="w-20 rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          {cartMessage && (
            <p className="mt-4 text-sm text-green-600">
              {cartMessage}
            </p>
          )}

          {cartError && (
            <p className="mt-4 text-sm text-red-600">
              {cartError}
            </p>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className="mt-6 w-fit rounded-md bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  );
};

export { ProductDetailsPage };