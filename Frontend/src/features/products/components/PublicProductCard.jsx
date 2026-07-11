import { useNavigate } from "react-router-dom";

const PublicProductCard = ({ product }) => {
  const navigate = useNavigate();
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];

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
            src={mainImage.url}
            alt={mainImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {product.images?.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            +{product.images.length - 1} more
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.amount}
            <span className="text-sm font-normal text-gray-400 ml-1">
              {product.price.currency}
            </span>
          </span>
          {product.seller?.fullname && (
            <span className="text-xs text-gray-400">by {product.seller.fullname}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProductCard;