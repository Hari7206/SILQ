import { useNavigate } from "react-router-dom";

const PublicProductCard = ({ product }) => {
  const navigate = useNavigate();

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
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#F5C451] transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="h-64 bg-gray-100 relative overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
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
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>

        {/* Price */}
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

          {/* Color dots */}
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

        {/* Trust Badges */}
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