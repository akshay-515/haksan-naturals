import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/public/HomePage";
import { ProductsPage } from "../pages/public/ProductsPage";
import { LoginPage } from "../pages/public/LoginPage";
import { CartPage } from "../pages/customer/CartPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export { AppRoutes };