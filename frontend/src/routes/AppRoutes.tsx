import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/public/HomePage";
import { ProductsPage } from "../pages/public/ProductsPage";
import { LoginPage } from "../pages/public/LoginPage";
import { CartPage } from "../pages/customer/CartPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";
import { ProductDetailsPage } from "../pages/public/ProductDetailsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AddressesPage } from "../pages/customer/AddressesPage";
import { CheckoutPage } from "../pages/customer/CheckoutPage";
import { OrderDetailsPage } from "../pages/customer/OrderDetailsPage";

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
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />}/>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export { AppRoutes };