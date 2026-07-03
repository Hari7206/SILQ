import { Routes, Route } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;