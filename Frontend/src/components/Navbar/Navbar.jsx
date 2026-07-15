
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../../features/cart/hook/useCart";
import { ShoppingBag, User, LogOut, LogIn, UserPlus, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../features/auth/hook/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Don't show navbar on seller pages
  if (location.pathname.startsWith("/seller")) {
    return null;
  }

  const runSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (typeof selectedGender !== "undefined" && selectedGender) {
      params.set("gender", selectedGender);
    }
    navigate(`/?${params.toString()}`);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-black tracking-widest cursor-pointer select-none"
        >
          <span className="text-gray-900">SI</span>
          <span className="text-[#F5C451]">LQ</span>
        </div>

        {/* Middle: Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search
              size={18}
              onClick={runSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingBag size={22} className="text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#F5C451] text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#F5C451] flex items-center justify-center text-gray-900 font-bold text-sm">
                  {user.fullname?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.fullname}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <User size={16} /> Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogIn size={16} /> Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition"
              >
                <UserPlus size={16} /> Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
