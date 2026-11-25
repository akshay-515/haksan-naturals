
import { Routes, Route } from "react-router-dom";

import { PublicLayout } from "../components/layout/PublicLayout";

import { HomePage } from "../pages/public/HomePage";
import { ProductsPage } from "../pages/public/ProductsPage";
import { LoginPage } from "../pages/public/LoginPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";
import { ProductDetailsPage } from "../pages/public/ProductDetailsPage";
import { GoogleCallbackPage } from "../pages/public/GoogleCallbackPage";

import { CartPage } from "../pages/customer/CartPage";
import { AddressesPage } from "../pages/customer/AddressesPage";
import { CheckoutPage } from "../pages/customer/CheckoutPage";
import { OrderDetailsPage } from "../pages/customer/OrderDetailsPage";
import { OrdersPage } from "../pages/customer/OrdersPage";

import { ProtectedRoute } from "./ProtectedRoute";

import { AdminLoginPage } from "../components/admin/AdminLoginPage";
import { AdminRoute } from "./AdminRoute";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminDashboardPage } from "../components/admin/AdminDashboardPage";
import { AdminProductsPage } from "../components/admin/AdminProductsPage";
import { AdminProductFormPage } from "../components/admin/AdminProductFormPage";
import { AdminProductEditPage } from "../components/admin/AdminProductEditPage";
import { AdminOrdersPage } from "../components/admin/AdminOrdersPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public website layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route
          path="/products/:productId"
          element={<ProductDetailsPage />}
        />
        <Route
          path="/auth/google/callback"
          element={<GoogleCallbackPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Customer protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Standalone admin login - no public navbar/footer */}
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Protected admin portal */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route
            path="/admin/products/new"
            element={<AdminProductFormPage />}
          />
          <Route
            path="/admin/products/:productId/edit"
            element={<AdminProductEditPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export { AppRoutes };
