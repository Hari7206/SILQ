import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CompleteProfile from "../features/auth/pages/CompleteProfile"; // ← NEW
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";

const AppRoutes = () => {
 const { checkAuth, handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
  <Route 
  path="/" 
  element={
    <div>
      <h1>Home</h1>
      {user ? (
        <>
          <p>Welcome, {user.fullname}! 👋</p>
          <p>Role: {user.role}</p>
          {user.contact && <p>Phone: {user.contact}</p>}
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  } 
/>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/complete-profile" element={<CompleteProfile />} /> {/* ← NEW */}
    </Routes>
  );
};

export default AppRoutes;