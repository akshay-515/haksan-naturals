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
import { OrdersPage } from "../pages/customer/OrdersPage";
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
        <Route path="/orders" element={<OrdersPage />}/>
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />}/>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products/new" element={<AdminProductFormPage />} />
          <Route path="/admin/products/:productId/edit" element={<AdminProductEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export { AppRoutes };