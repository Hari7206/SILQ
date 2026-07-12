import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
<<<<<<< HEAD
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Star } from "lucide-react";
=======
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, RotateCcw, Wallet, Sparkles, Truck, ShieldCheck } from "lucide-react";
>>>>>>> 82f10fe (varient added)

const PublicProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPublicProductById, product, loading } = useProduct();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
<<<<<<< HEAD
=======
  const [selectedVariant, setSelectedVariant] = useState(null);
>>>>>>> 82f10fe (varient added)

  useEffect(() => {
    fetchPublicProductById(id);
  }, [id]);

<<<<<<< HEAD
  const nextImage = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
=======
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
      setCurrentImageIndex(0);
    }
  }, [product]);

  const nextImage = () => {
    if (selectedVariant?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedVariant.images.length);
>>>>>>> 82f10fe (varient added)
    }
  };

  const prevImage = () => {
<<<<<<< HEAD
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

=======
    if (selectedVariant?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedVariant.images.length) % selectedVariant.images.length);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setCurrentImageIndex(0);
  };

>>>>>>> 82f10fe (varient added)
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
<<<<<<< HEAD
          <button
            onClick={() => navigate("/products")}
            className="mt-4 text-[#F5C451] hover:underline"
          >
            Back to products
=======
          <button onClick={() => navigate("/")} className="mt-4 text-[#F5C451] hover:underline">
            Back to home
>>>>>>> 82f10fe (varient added)
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
=======
  const images = selectedVariant?.images || [];
  const currentImage = images[currentImageIndex] || product.mainImage || images[0];
  const priceRange = product.priceRange || { min: 0, max: 0 };
  const hasPriceRange = priceRange.min !== priceRange.max;
>>>>>>> 82f10fe (varient added)

  return (
    <div className="min-h-screen bg-[#FBF4E8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
<<<<<<< HEAD
          onClick={() => navigate("/products")}
=======
          onClick={() => navigate("/")}
>>>>>>> 82f10fe (varient added)
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-6"
        >
          <ChevronLeft size={16} />
          Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div>
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden aspect-square">
<<<<<<< HEAD
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
=======
              {currentImage ? (
                <img src={currentImage} alt={product.title} className="w-full h-full object-contain p-4" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}

              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition">
>>>>>>> 82f10fe (varient added)
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

<<<<<<< HEAD
              {/* Image counter */}
              {product.images?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {product.images.length}
=======
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {images.length}
>>>>>>> 82f10fe (varient added)
                </div>
              )}
            </div>

            {/* Thumbnails */}
<<<<<<< HEAD
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
=======
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
>>>>>>> 82f10fe (varient added)
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition flex-shrink-0 ${
                      currentImageIndex === index ? "border-[#F5C451]" : "border-transparent hover:border-gray-300"
                    }`}
                  >
<<<<<<< HEAD
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
=======
                    <img src={img} alt={`${product.title} - ${index + 1}`} className="w-full h-full object-cover" />
>>>>>>> 82f10fe (varient added)
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
<<<<<<< HEAD
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
=======
              <p className="text-sm text-gray-500 mt-1">by {product.seller?.fullname || "SILQ"}</p>
            </div>

            {/* Price */}
            <div>
              {hasPriceRange ? (
                <div>
                  <span className="text-3xl font-bold text-gray-900">₹{priceRange.min}</span>
                  <span className="text-gray-400 text-2xl mx-2">-</span>
                  <span className="text-3xl font-bold text-gray-900">₹{priceRange.max}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">₹{priceRange.min}</span>
              )}
              <span className="text-sm text-gray-400 ml-2">INR</span>
              {selectedVariant && hasPriceRange && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: <span className="font-semibold">₹{selectedVariant.price.amount}</span>
                </p>
              )}
            </div>

            {/* Color Variants */}
            {product.variants?.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Color: <span className="font-normal">{selectedVariant?.color || "Select"}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => {
                    const isSelected = selectedVariant?.color === variant.color;
                    return (
                      <button
                        key={index}
                        onClick={() => handleVariantSelect(variant)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                          isSelected
                            ? "border-[#F5C451] bg-[#FDF7E8] ring-2 ring-[#F5C451]/30"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: variant.colorCode || "#ccc" }}
                        />
                        <span className="text-sm font-medium text-gray-700">{variant.color}</span>
                        {isSelected && <span className="text-xs text-[#B8860B]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.availableSizes?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <span key={size} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:border-[#F5C451] cursor-pointer transition">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${selectedVariant?.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {selectedVariant?.stock > 0 ? `In Stock (${selectedVariant.stock})` : "Out of Stock"}
              </span>
>>>>>>> 82f10fe (varient added)
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

<<<<<<< HEAD
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
=======
            {/* Trust Badges */}
            {Object.values(product.badges || {}).some(v => v === true) && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Why choose this</h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.badges?.sevenDayReturn && (
                    <span className="flex items-center gap-2 text-sm text-gray-700"><RotateCcw size={14} className="text-green-600" /> 7-Day Return</span>
                  )}
                  {product.badges?.cashOnDelivery && (
                    <span className="flex items-center gap-2 text-sm text-gray-700"><Wallet size={14} className="text-blue-600" /> Cash on Delivery</span>
                  )}
                  {product.badges?.silkAssured && (
                    <span className="flex items-center gap-2 text-sm text-gray-700"><Sparkles size={14} className="text-purple-600" /> Silk Assured</span>
                  )}
                  {product.badges?.freeShipping && (
                    <span className="flex items-center gap-2 text-sm text-gray-700"><Truck size={14} className="text-emerald-600" /> Free Shipping</span>
                  )}
                  {product.badges?.authenticProduct && (
                    <span className="flex items-center gap-2 text-sm text-gray-700"><ShieldCheck size={14} className="text-indigo-600" /> Authentic</span>
                  )}
                </div>
              </div>
            )}
>>>>>>> 82f10fe (varient added)

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
<<<<<<< HEAD
                disabled={product.stock === 0}
=======
                disabled={selectedVariant?.stock === 0}
>>>>>>> 82f10fe (varient added)
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