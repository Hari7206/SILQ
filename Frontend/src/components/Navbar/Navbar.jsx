import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../../features/cart/hook/useCart";
import { ShoppingBag, User, LogOut, LogIn, UserPlus, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../features/auth/hook/useAuth";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Don't show navbar on seller pages
  if (location.pathname.startsWith("/seller")) {
    return null;
  }

  // Fetch suggestions when typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/products/public/search-suggestions?q=${encodeURIComponent(searchTerm)}`,
          { withCredentials: true }
        );
        const results = res.data.suggestions || [];
        setSuggestions(results);
        // ✅ Only show suggestions if there are results
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    navigate(`/?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ✅ IMPORTANT: Only show dropdown when ALL conditions are met
  const shouldShowDropdown = showSuggestions && searchTerm.length >= 2 && suggestions.length > 0;

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

        {/* Middle: Search with Suggestions */}
        <div className="flex-1 max-w-md mx-6 relative" ref={searchRef}>
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
              className="
w-full
pl-10
pr-10
py-2.5
rounded-xl
bg-gray-50
border
border-gray-200
outline-none
ring-0
focus:outline-none
focus:ring-0
focus:border-gray-200
appearance-none
"
            
              onFocus={(e) => {
                e.target.style.border = "1px solid transparent";
                e.target.style.boxShadow = "0 0 0 2px #111827";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ✅ Suggestions Dropdown - ONLY shows when there are actual suggestions */}
          {shouldShowDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50">
              {isLoadingSuggestions ? (
                <div className="p-4 text-center text-sm text-gray-400">
                  <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-[#F5C451] rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                <>
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product._id)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-50 last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {product.mainImage ? (
                          <img
                            src={product.mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            📷
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                            {product.category}
                          </span>
                          {product.gender && (
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                              {product.gender}
                            </span>
                          )}
                          {product.relevance === 1 && (
                            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              Perfect match
                            </span>
                          )}
                          {product.relevance >= 0.5 && product.relevance < 1 && (
                            <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              {Math.round(product.relevance * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {product.matchedFields?.join(", ")}
                      </span>
                    </div>
                  ))}
                  <div
                    onClick={runSearch}
                    className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 cursor-pointer transition border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Search size={14} />
                    Search for <span className="font-medium text-gray-800">"{searchTerm}"</span> in all products
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side (Cart + User) */}
        <div className="flex items-center gap-4">
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