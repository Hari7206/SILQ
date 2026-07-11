import { Routes, Route  , Navigate} from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";
import ProtectedRoute from "../features/auth/component/ProtectedRoute"

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import CompleteProfile from "../features/auth/pages/CompleteProfile";

import SellerProducts from "../features/products/pages/SellerProducts";
import CreateProduct from "../features/products/pages/CreateProduct";
import EditProduct from "../features/products/pages/EditProduct";

const AppRoutes = () => {
  const { checkAuth } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;