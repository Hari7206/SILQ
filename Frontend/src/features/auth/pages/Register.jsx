import { useState } from "react";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await handleRegister(formData);
      // Navigate to login after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-[#FBF4E8] flex flex-col">
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
            onClick={goToLogin}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Login
          </button>
          <a
            href="#"
            className="bg-[#F5C451] text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-[#f0ba33] transition"
          >
            Request Demo
          </a>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center px-4 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-sm text-gray-500">
              Enter your details to get started
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="fullname"
              placeholder="Full name"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451] focus:border-transparent"
            />

            <input
              type="text"
              name="contact"
              placeholder="Contact number"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451] focus:border-transparent"
            />

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

          <label className="flex items-center gap-2 text-sm text-gray-600 pl-1">
            <input
              type="checkbox"
              name="isSeller"
              checked={formData.isSeller}
              onChange={handleChange}
              className="accent-[#F5C451] w-4 h-4"
            />
            Register as a seller
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold p-3 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={goToLogin}
              className="text-gray-900 font-medium hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </form>
      </div>

      <div className="text-center text-xs text-gray-400 pb-6 relative z-10 flex-shrink-0">
        Copyright @SILQ 2026 &nbsp;|&nbsp; Privacy Policy &nbsp;|&nbsp; Terms & Conditions
      </div>
    </div>
  );
}

export default Register;