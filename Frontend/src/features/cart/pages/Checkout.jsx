import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar/Navbar";
import { ChevronLeft, MapPin, Phone, User } from "lucide-react";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalAmount, createOrder, verifyPayment, loading } = useCart();
  const user = useSelector((state) => state.auth.user);

  const [address, setAddress] = useState({
    fullname: user?.fullname || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate("/cart");
    }
  }, [items, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    const required = ["fullname", "phone", "addressLine1", "city", "state", "pincode"];
    required.forEach((field) => {
      if (!address[field]?.trim()) {
        newErrors[field] = `${field} is required`;
      }
    });
    if (address.phone && !/^[0-9]{10}$/.test(address.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (address.pincode && !/^[0-9]{6}$/.test(address.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateAddress()) {
      return;
    }
    
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = await createOrder(address);
      
      if (!orderData.success) {
        alert(orderData.message || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      const { razorpayOrderId, amount, keyId, orderId } = orderData.data;

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "SILQ",
        description: `Order #${orderId.slice(-6)}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyData = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderId,
            });

            if (verifyData.success) {
              navigate("/order-success", {
                state: { orderId: orderId },
              });
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            alert(error.response?.data?.message || "Payment verification failed");
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        prefill: {
          name: address.fullname,
          contact: address.phone,
        },
        theme: {
          color: "#004d40",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#004d40] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-[#1a202c]">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#1a202c] mb-6 flex items-center gap-2">
                <MapPin size={20} /> Delivery Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="fullname"
                      value={address.fullname}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.fullname ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#004d40]"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#004d40]"
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.addressLine1 ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#004d40]"
                    }`}
                    placeholder="Street address, building name"
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d40]"
                    placeholder="Apartment, suite, floor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.city ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#004d40]"
                      }`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.state ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#004d40]"
                      }`}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.pincode ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#004d40]"
                    }`}
                    placeholder="Pincode"
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-[#1a202c] mb-6">Order Summary</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 border-b border-gray-100 pb-3">
                    <img
                      src={item.product?.mainImage || "https://via.placeholder.com/50"}
                      alt={item.product?.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.product?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.variant?.color} • {item.size} • x{item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[#0d6955]">
                        ₹{item.subtotal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-[#1a202c] mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || loading}
                className="w-full bg-[#004d40] hover:bg-[#003d33] text-white font-semibold py-3 rounded-lg transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : `Pay ₹${totalAmount}`}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                 Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;