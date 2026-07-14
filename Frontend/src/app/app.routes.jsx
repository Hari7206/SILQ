import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import CompleteProfile from "../features/auth/pages/CompleteProfile";
import ProtectedRoute from "../features/auth/component/ProtectedRoute";

import PublicProducts from "../features/products/pages/PublicProducts";
import PublicProductDetail from "../features/products/pages/PublicProductDetail";
import SellerProducts from "../features/products/pages/SellerProducts";
import CreateProduct from "../features/products/pages/CreateProduct";
import EditProduct from "../features/products/pages/EditProduct";
// Add import
import Cart from "../features/cart/pages/Cart";

// Add route


const AppRoutes = () => {
  const { checkAuth } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicProducts />} />
      <Route path="/products/:id" element={<PublicProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      {/* Protected Routes (Seller only) */}
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <SellerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/create"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default AppRoutes;