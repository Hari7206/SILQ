import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../service/auth.api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-[#FBF4E8] flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-600 text-sm p-4 rounded-lg mb-4">
              ✅ We've sent a reset link to your email!
              <br />
              <span className="text-xs text-gray-500">
                Please check your inbox (and spam folder).
              </span>
            </div>
            <button
              onClick={goToLogin}
              className="text-[#F5C451] hover:underline font-medium"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <input
              type="email"
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold p-3 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={goToLogin}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;