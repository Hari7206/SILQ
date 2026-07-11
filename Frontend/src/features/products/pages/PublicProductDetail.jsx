import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Star } from "lucide-react";

const PublicProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPublicProductById, product, loading } = useProduct();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPublicProductById(id);
  }, [id]);

  const nextImage = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F5C451] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 text-[#F5C451] hover:underline"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];

  return (
    <div className="min-h-screen bg-[#FBF4E8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-6"
        >
          <ChevronLeft size={16} />
          Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div>
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden aspect-square">
              {mainImage ? (
                <img
                  src={product.images[currentImageIndex].url}
                  alt={product.images[currentImageIndex].alt}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image counter */}
              {product.images?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition flex-shrink-0 ${
                      currentImageIndex === index ? "border-[#F5C451]" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <span className="inline-block bg-[#FDF3DC] text-[#B8860B] text-xs font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full ml-2">
                  {product.subCategory}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                by {product.seller?.fullname || "SILQ"}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.amount}
              </span>
              <span className="text-sm text-gray-400">{product.price.currency}</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              {product.availableSizes?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sizes</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.availableSizes.map((size) => (
                      <span key={size} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.colors?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Colors</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.colors.map((color) => (
                      <span key={color} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.fabric && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fabric</h4>
                  <p className="text-sm text-gray-700 mt-1">{product.fabric}</p>
                </div>
              )}
              {product.occasion?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Occasion</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.occasion.map((occ) => (
                      <span key={occ} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold px-6 py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button className="p-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                <Heart size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProductDetail;