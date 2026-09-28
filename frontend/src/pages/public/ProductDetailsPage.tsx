import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/ProductApi";
import type { Product } from "../../types/product";

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();

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
      </div>
    </main>
  );
};

export { ProductDetailsPage };