import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Trash2 } from "lucide-react";

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  
  const mainImage = product.mainImage || product.variants?.[0]?.images?.[0];
  const priceRange = product.priceRange || { min: 0, max: 0 };
  const totalStock = product.totalStock || 0;

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col w-full transition-all duration-300 hover:shadow-[0_16px_35px_rgba(0,0,0,0.06)] group">
      
      <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-[#F5F5F5]">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-wider">
            No image
          </div>
        )}

        <div className="absolute top-3 left-3 bg-black/45 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide">
          {product.isActive ? "Active" : "Inactive"}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product._id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 hover:scale-105 transition-all duration-200"
          title="Delete Product"
        >
          <Trash2 size={13} />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-bold text-gray-900 text-base tracking-tight mb-0.5 line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-xs text-gray-400 font-medium mb-1">
          {product.category || "Uncategorized"}
        </p>
        
        <p className="text-xs text-gray-400/90 font-normal leading-relaxed line-clamp-2 mb-5">
          {product.description || `Stock available: ${totalStock} units. Manage your current listings directly from the interactive control bar.`}
        </p>

        <div className="flex items-center justify-between mt-auto pt-1">
          
          <div className="bg-[#EEF0F2] text-gray-900 text-xs font-bold px-4 py-2 rounded-full">
            ₹{priceRange.min || "0"}
          </div>

          <button 
            onClick={() => navigate(`/seller/products/edit/${product._id}`)}
            className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            Edit Item <ArrowUpRight size={13} strokeWidth={2.5} />
          </button>
          
        </div>
      </div>

    </div>
  );
};

export default ProductCard;