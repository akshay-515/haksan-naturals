import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/ProductApi";
import { addToCart } from "../../api/cartApi";
import type { Product } from "../../types/product";

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();

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
        <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900">
            {product.name}
        </h2>

        <p className="mt-4 text-gray-600">
            {product.description}
        </p>

        <p className="mt-6 text-2xl font-bold text-green-700">
            ₹{product.price}
        </p>

        <p className="mt-2 text-sm text-gray-500">
            Stock: {product.stock}
        </p>

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
            onChange={(event) =>
                setQuantity(Number(event.target.value))
            }
            className="w-20 rounded-md border border-gray-300 px-3 py-2"
            />
        </div>

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
            className="mt-6 rounded-md bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {addingToCart ? "Adding..." : "Add to Cart"}
        </button>
        </div>
      </main>
    );
};

export { ProductDetailsPage };