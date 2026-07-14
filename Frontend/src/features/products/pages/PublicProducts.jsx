import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import PublicProductCard from "../components/PublicProductCard";
import { Search, ShoppingBag } from "lucide-react";

const PublicProducts = () => {
  const navigate = useNavigate();
  const { fetchPublicProducts, products, loading } = useProduct();
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchPublicProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F5C451] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF4E8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Row: Title + Cart Icon */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop SILQ</h1>
              <p className="text-gray-500 mt-1">Discover our curated collection</p>
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingBag size={24} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F5C451] text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-[#F5C451] focus:border-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            {searchTerm && <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <PublicProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProducts;