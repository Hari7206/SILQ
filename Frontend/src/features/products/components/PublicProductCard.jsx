import { useNavigate } from "react-router-dom";

const PublicProductCard = ({ product, highlightColor }) => {
  const navigate = useNavigate();

  // Show the correct color image
  let mainImage = product.mainImage || product.variants?.[0]?.images?.[0];

  if (highlightColor) {
    const matchingVariant = product.variants?.find(
      (v) => v.color?.toLowerCase() === highlightColor?.toLowerCase()
    );
    if (matchingVariant?.images?.length > 0) {
      mainImage = matchingVariant.images[0];
    }
  }

  // ✅ Add fallback image if mainImage is broken
  const imageUrl = mainImage || "https://via.placeholder.com/400x400?text=No+Image";

  const priceRange = product.priceRange || { min: 0, max: 0 };
  const hasPriceRange = priceRange.min !== priceRange.max;
  const totalStock = product.totalStock || 0;

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#F5C451] transition-all cursor-pointer group"
    >
      <div className="h-64 bg-gray-100 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
        {totalStock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-[#F5C451] text-gray-900 text-xs font-medium px-3 py-1 rounded-full">
            Featured
          </span>
        )}
        {highlightColor && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            {highlightColor}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>

        <div className="flex items-center justify-between mt-2">
          <div>
            {hasPriceRange ? (
              <div>
                <span className="text-lg font-bold text-gray-900">₹{priceRange.min}</span>
                <span className="text-gray-400 mx-1">-</span>
                <span className="text-lg font-bold text-gray-900">₹{priceRange.max}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">₹{priceRange.min}</span>
            )}
            <span className="text-xs text-gray-400 ml-1">INR</span>
          </div>

          {product.variants?.length > 1 && (
            <div className="flex gap-1">
              {product.variants.slice(0, 4).map((variant, index) => (
                <span
                  key={index}
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: variant.colorCode || "#ccc" }}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-xs text-gray-400 mt-1">+{product.variants.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {Object.values(product.badges || {}).some(v => v === true) && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.badges?.sevenDayReturn && (
              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                🔄 7-Day Return
              </span>
            )}
            {product.badges?.cashOnDelivery && (
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                💰 COD
              </span>
            )}
            {product.badges?.silkAssured && (
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                ✨ Silk Assured
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProductCard;