import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { Search, Plus } from "lucide-react";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteExistingProduct } = useProduct();
  const user = useSelector((state) => state.auth.user);
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user && user.role !== "seller") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteExistingProduct(id);
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.title?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#F17A5D] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      
      <div className="max-w-[1400px] mx-auto px-6 pt-6 flex items-center justify-between">
        <div 
          className="text-2xl font-black tracking-widest cursor-pointer select-none" 
          onClick={() => navigate("/seller/products")}
        >
          <span className="text-gray-900">SI</span>
          <span className="text-[#F17A5D]">LQ</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-4">
        <div className="relative h-[260px] md:h-[340px] w-full rounded-[2rem] overflow-hidden bg-gray-900 flex items-center px-8 md:px-16 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Workspace Interior" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-black/25"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none mb-4">
              Dashboard
            </h1>
            <p className="text-white/90 text-sm md:text-base font-normal max-w-lg leading-relaxed italic tracking-wide">
              "Great products don't just sell themselves. They are built with passion, curated with care, and managed with absolute precision."
            </p>
          </div>
        </div>

        <div className="relative -mt-7 z-20 max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-gray-100 p-1.5 flex items-center gap-2">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your collection..." 
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-400 focus:ring-0"
              />
            </div>
            <button 
              onClick={() => navigate("/seller/products/create")} 
              className="bg-black hover:bg-gray-900 active:scale-95 text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-200 shrink-0 shadow-sm"
            >
              <Plus size={14} strokeWidth={2.5} /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-16">
        <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-3xl font-serif italic font-medium text-gray-800 tracking-wide normal-case">
            My collection
          </h2>
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase pb-1">
            {filteredProducts.length} listed {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#F9F9F9] rounded-[2rem] py-16 text-center border border-gray-100 max-w-xl mx-auto px-4">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">
              {searchQuery ? "No matches discovered" : "Your showroom is empty"}
            </p>
            <button 
              onClick={() => {
                if (searchQuery) setSearchQuery("");
                else navigate("/seller/products/create");
              }}
              className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition active:scale-95"
            >
              {searchQuery ? "Clear Search Filter" : "Upload Your First Design"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;