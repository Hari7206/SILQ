import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword, verifyResetToken } from "../service/auth.api";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await verifyResetToken(token);
        setIsValidToken(true);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired reset link");
        setIsValidToken(false);
      } finally {
        setVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex justify-center items-center">
        <div className="text-center">
          <p>Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-gray-900">Invalid Reset Link</h1>
          <p className="text-sm text-gray-500 mt-2">
            {error || "This reset link is invalid or has expired."}
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-4 text-[#F5C451] hover:underline font-medium"
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-900">Password Reset!</h1>
          <p className="text-sm text-gray-500 mt-2">
            Your password has been reset successfully.
          </p>
          <p className="text-xs text-gray-400 mt-1">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF4E8] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451]"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold p-3 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;