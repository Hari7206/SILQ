import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";
import ProtectedRoute from "../features/auth/component/ProtectedRoute";
import Layout from "../components/Layout/Layout"; // ← NEW

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import CompleteProfile from "../features/auth/pages/CompleteProfile";

import PublicProducts from "../features/products/pages/PublicProducts";
import PublicProductDetail from "../features/products/pages/PublicProductDetail";
import SellerProducts from "../features/products/pages/SellerProducts";
import CreateProduct from "../features/products/pages/CreateProduct";
import EditProduct from "../features/products/pages/EditProduct";
import Cart from "../features/cart/pages/Cart";


import Checkout from "../features/cart/pages/Checkout";
import OrderSuccess from "../features/cart/pages/OrderSuccess";

const AppRoutes = () => {
  const { checkAuth } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PublicProducts />} />
        <Route path="/products/:id" element={<PublicProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

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

      <Route path="/checkout" element={<Checkout />} />         
  <Route path="/order-success" element={<OrderSuccess />} />  

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;