
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { Search, Plus } from "lucide-react";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteExistingProduct } = useProduct();
  const user = useSelector((state) => state.auth.user);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#F17A5D] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      
      {/* Top Navigation Bar */}
      <div className="max-w-[1400px] mx-auto px-6 pt-6 flex items-center justify-between">
        {/* SILQ Logo with stand-out accent color */}
        <div className="text-2xl font-black tracking-widest cursor-pointer" onClick={() => navigate("/seller/products")}>
          <span className="text-gray-900">SI</span>
          <span className="text-[#F17A5D]">LQ</span>
        </div>
      </div>

      {/* Hero Section with Enhanced Shadow & Deep Dark Overlay */}
      <div className="max-w-[1400px] mx-auto px-6 pt-4">
        <div className="relative h-[260px] md:h-[340px] w-full rounded-[2rem] overflow-hidden bg-gray-900 flex items-center px-8 md:px-16">
          {/* Same background image with a heavy darkness configuration */}
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Workspace Interior" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4] contrast-[1.1]"
          />
          {/* Direct dark mask overlay layer */}
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

        {/* Floating Search & Add Action Bar */}
        <div className="relative -mt-7 z-20 max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 p-1.5 flex items-center gap-2">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search your collection..." 
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-400 focus:ring-0"
              />
            </div>
            <button 
              onClick={() => navigate("/seller/products/create")} 
              className="bg-black hover:bg-gray-900 text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Product Catalog Grid */}
      <div className="max-w-[1400px] mx-auto px-6 mt-16">
        <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
          {/* Changed text font to an elegant, classic editorial serif style */}
          <h2 className="text-3xl font-serif italic font-medium text-gray-800 tracking-wide normal-case">
            My collection
          </h2>
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase pb-1">
            {products.length} listed {products.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="bg-[#F9F9F9] rounded-[2rem] py-16 text-center border border-gray-100">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-4">Your showroom is empty</p>
            <button 
              onClick={() => navigate("/seller/products/create")}
              className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Upload Your First Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
