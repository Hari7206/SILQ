import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useSelector } from "react-redux";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "../../../components/Navbar/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, loading, fetchCart, updateQuantity, removeFromCart } = useCart();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      await removeFromCart(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F5C451] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't added any items yet.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold px-6 py-3 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF4E8] py-8">
         <Navbar />
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          <span className="text-sm text-gray-500">{totalItems} items</span>
        </div>

        {/* Cart Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:shadow-md transition"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.product?.mainImage || "https://via.placeholder.com/100"}
                    alt={item.product?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.product?.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.variant?.color} • {item.size}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    ₹{item.price?.amount} × {item.quantity} = ₹{item.subtotal}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition mt-4">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;