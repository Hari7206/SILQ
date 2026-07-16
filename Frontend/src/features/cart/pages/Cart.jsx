import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useSelector } from "react-redux";
import { Trash2, Lock, RefreshCw, Plus } from "lucide-react";
import Navbar from "../../../components/Navbar/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, loading, fetchCart, updateQuantity, removeFromCart } = useCart();
  const user = useSelector((state) => state.auth.user);

  // ✅ Only fetch cart once on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, []); 

  // ✅ Update quantity - NO reload
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(id, newQuantity);
  };

  // ✅ Remove item - NO reload
  const handleRemoveItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      await removeFromCart(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#004d40] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold text-[#1f2937]">Your Shopping Bag is empty</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added any items yet.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-[#004d40] hover:bg-[#003d33] text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-[#1a202c] mb-8">Shopping Bag</h1>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-6 pb-6 border-b border-gray-200"
              >
                {/* Image */}
                <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                  <img
                    src={item.product?.mainImage || "https://via.placeholder.com/150"}
                    alt={item.product?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#1a202c] text-lg">{item.product?.title}</h3>
                      {/* Price styling matches the green text in the screenshot */}
                      <span className="text-[#0d6955] font-bold text-lg">
                        ₹{item.price?.amount || item.subtotal}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Color: {item.variant?.color || "N/A"}</p>
                    <p className="text-sm text-gray-500">Size: {item.size || "N/A"}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-medium border-x border-gray-300 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-400 hover:text-red-600 transition text-sm font-semibold flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#f4f7f9] rounded-xl p-6 sticky top-6">
              <h2 className="text-lg font-bold text-[#1a202c] mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>₹0.00</span> {/* Add actual tax logic here if needed */}
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-[#1a202c] mt-6 pt-6 border-t border-gray-300">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              {/* Promo Code Input */}
              <div className="mt-6">
                <label className="block text-xs font-medium text-gray-600 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#004d40]"
                  />
                  <button className="bg-[#e0effe] text-[#1e40af] font-semibold px-4 py-2 rounded text-sm hover:bg-[#bfdbfe] transition">
                    Apply
                  </button>
                </div>
              </div>

              <button className="w-full bg-[#004d40] hover:bg-[#003d33] text-white font-semibold py-3 rounded-lg transition mt-6">
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-[#004d40]"/> Secure SSL Checkout
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-[#004d40]"/> 30-Day Effortless Returns
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Your Look (Static UI addition based on image) */}
        <div className="mt-20">
          <h2 className="text-xl font-bold text-[#1a202c] mb-6">Complete Your Look</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example Card 1 */}
            <div>
              <div className="bg-gray-100 h-64 mb-4 relative">
                <img src="https://via.placeholder.com/300x400?text=Tie" alt="Tie" className="w-full h-full object-cover" />
                <button className="absolute bottom-4 right-4 bg-[#004d40] text-white p-2 rounded-full shadow-md hover:bg-[#003d33]">
                  <Plus size={16} />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">Silk Geometric Tie</h4>
              <p className="text-sm text-[#0d6955] font-semibold">₹85.00</p>
            </div>
            {/* Example Card 2 */}
            <div>
              <div className="bg-gray-100 h-64 mb-4 relative">
                <img src="https://via.placeholder.com/300x400?text=Aviators" alt="Aviators" className="w-full h-full object-cover" />
                <button className="absolute bottom-4 right-4 bg-[#004d40] text-white p-2 rounded-full shadow-md hover:bg-[#003d33]">
                  <Plus size={16} />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">Titanium Gold Aviators</h4>
              <p className="text-sm text-[#0d6955] font-semibold">₹310.00</p>
            </div>
            {/* Example Card 3 */}
            <div>
              <div className="bg-gray-100 h-64 mb-4 relative">
                <img src="https://via.placeholder.com/300x400?text=Belt" alt="Belt" className="w-full h-full object-cover" />
                <button className="absolute bottom-4 right-4 bg-[#004d40] text-white p-2 rounded-full shadow-md hover:bg-[#003d33]">
                  <Plus size={16} />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-gray-900">Heritage Leather Belt</h4>
              <p className="text-sm text-[#0d6955] font-semibold">₹120.00</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;