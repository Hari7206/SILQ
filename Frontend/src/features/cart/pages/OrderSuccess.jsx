import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import Navbar from "../../../components/Navbar/Navbar";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#1a202c] mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            Your order has been placed successfully.
            {orderId && (
              <span className="block text-sm text-gray-400 mt-1">
                Order ID: #{orderId.slice(-8)}
              </span>
            )}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              We'll send you a confirmation email with order details.
              You can track your order from the Orders page.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 bg-[#004d40] hover:bg-[#003d33] text-white font-semibold py-3 rounded-lg transition"
            >
              <Home size={18} /> Continue Shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition"
            >
              <ShoppingBag size={18} /> View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;