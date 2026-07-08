import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CompleteProfile from "../features/auth/pages/CompleteProfile";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import SellerProducts from "../features/products/pages/SellerProducts";
import CreateProduct from "../features/products/pages/CreateProduct";
import EditProduct from "../features/products/pages/EditProduct";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { checkAuth } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/seller/products" element={<SellerProducts />} />
      <Route path="/seller/products/create" element={<CreateProduct />} />
      <Route path="/seller/products/edit/:id" element={<EditProduct />} />
    </Routes>
  );
};

export default AppRoutes;