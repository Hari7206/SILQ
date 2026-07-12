import { useNavigate } from "react-router-dom";

const PublicProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Pure unaltered logic computations
  const mainImage = product.mainImage || product.variants?.[0]?.images?.[0];
  const priceRange = product.priceRange || { min: 0, max: 0 };
  const hasPriceRange = priceRange.min !== priceRange.max;
  const totalStock = product.totalStock || 0;

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col w-full transition-all duration-300 hover:shadow-[0_16px_35px_rgba(0,0,0,0.06)] hover:border-gray-200 cursor-pointer group"
    >
      {/* Aspect-Ratio Guarded Image Container */}
      <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-4 bg-[#F5F5F5]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-wider">
            No image
          </div>
        )}
        
        {/* Absolute Floating UI Elements */}
        {totalStock === 0 && (
          <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-sm">
            Out of Stock
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-[#F5C451] text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Typography & Details Block */}
      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-bold text-gray-900 text-base tracking-tight mb-0.5 truncate">
          {product.title}
        </h3>
        <p className="text-xs text-gray-400 font-medium mb-3">
          {product.category || "General Collection"}
        </p>

        {/* Price & Variant Row */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-baseline gap-1">
            {hasPriceRange ? (
              <div className="flex items-center gap-1">
                <span className="text-base font-black text-gray-900">₹{priceRange.min}</span>
                <span className="text-gray-300 text-xs font-normal">-</span>
                <span className="text-base font-black text-gray-900">₹{priceRange.max}</span>
              </div>
            ) : (
              <span className="text-base font-black text-gray-900">₹{priceRange.min}</span>
            )}
            <span className="text-[10px] font-bold text-gray-400 tracking-wider ml-0.5">INR</span>
          </div>

          {/* Minimalist Micro Color Variant Indicator Ring */}
          {product.variants?.length > 1 && (
            <div className="flex items-center -space-x-1.5 dynamic-swatches">
              {product.variants.slice(0, 4).map((variant, index) => (
                <span
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.04)] block shrink-0"
                  style={{ backgroundColor: variant.colorCode || "#ccc" }}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] font-bold text-gray-400 pl-2 bg-white shrink-0 z-10">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Editorial Trust Curated Badges */}
        {Object.values(product.badges || {}).some(v => v === true) && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-50">
            {product.badges?.sevenDayReturn && (
              <span className="text-[10px] font-semibold bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-100/80 tracking-tight flex items-center gap-1">
                <span className="text-xs scale-90">🔄</span> 7-Day Return
              </span>
            )}
            {product.badges?.cashOnDelivery && (
              <span className="text-[10px] font-semibold bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-100/80 tracking-tight flex items-center gap-1">
                <span className="text-xs scale-90">💰</span> COD
              </span>
            )}
            {product.badges?.silkAssured && (
              <span className="text-[10px] font-bold bg-[#FFFBF0] text-[#DCA216] px-2.5 py-1 rounded-full border border-[#FBEFCD] tracking-tight flex items-center gap-1">
                <span className="text-xs scale-90">✨</span> Silk Assured
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProductCard;