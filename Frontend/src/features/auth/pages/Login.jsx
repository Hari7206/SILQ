import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === "seller") {
        navigate("/seller/products", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await handleLogin(formData);
      // Redirect based on role
      if (data?.user?.role === "seller") {
        navigate("/seller/products", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToHome = () => {
    navigate("/");
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F5C451] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If already logged in, don't show login page (redirect happens in useEffect)
  if (user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#FBF4E8] flex flex-col">
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-6 relative z-20 flex-shrink-0">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={goToHome}
        >
          <span className="text-lg">◆</span>
          <span className="font-bold text-2xl tracking-wide">
            <span className="text-[#2B2B2B]">SI</span>
            <span className="text-[#F5C451]">LQ</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={goToRegister}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Register
          </button>
          <a
            href="#"
            className="bg-[#F5C451] text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-[#f0ba33] transition"
          >
            Request Demo
          </a>
        </div>
      </div>

      {/* Main content - centered both vertically and horizontally */}
      <div className="flex-1 flex justify-center items-center px-4 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email here"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451] focus:border-transparent"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password here"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451] focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 pl-1">
              <input
                type="checkbox"
                className="accent-[#F5C451] w-4 h-4"
              />
              Remember me
            </label>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-[#F5C451] hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold p-3 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={goToRegister}
              className="text-gray-900 font-medium hover:underline cursor-pointer"
            >
              Register
            </button>
          </p>
         
          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
            className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium p-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-gray-400 pb-6 relative z-10 flex-shrink-0">
        Copyright @SILQ 2026 &nbsp;|&nbsp; Privacy Policy &nbsp;|&nbsp; Terms & Conditions
      </div>
    </div>
  );
}

export default Login;