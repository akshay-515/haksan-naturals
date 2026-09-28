import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/public/HomePage";
import { ProductsPage } from "../pages/public/ProductsPage";
import { LoginPage } from "../pages/public/LoginPage";
import { CartPage } from "../pages/customer/CartPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";
import { ProductDetailsPage } from "../pages/public/ProductDetailsPage";
import { ProtectedRoute } from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route
        path="/products/:productId"
        element={<ProductDetailsPage />}
      />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<CartPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export { AppRoutes };