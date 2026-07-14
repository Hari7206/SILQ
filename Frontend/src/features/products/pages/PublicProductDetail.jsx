import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import Navbar from "../../../components/Navbar/Navbar";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  RotateCcw,
  Wallet,
  Sparkles,
  Truck,
  ShieldCheck,
  ZoomIn,
  Star,
} from "lucide-react";

const TABS = ["Details", "Shipping & Returns"];

const PublicProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPublicProductById, product, loading } = useProduct();
  const { addToCart, loading: cartLoading } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  useEffect(() => {
    fetchPublicProductById(id);
  }, [id]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
      setCurrentImageIndex(0);
    }
  }, [product]);

  const nextImage = () => {
    if (selectedVariant?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedVariant.images.length);
    }
  };

  const prevImage = () => {
    if (selectedVariant?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedVariant.images.length) % selectedVariant.images.length);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setCurrentImageIndex(0);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Please select a color");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (selectedVariant.stock === 0) {
      alert("This product is out of stock");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        size: selectedSize,
        quantity: 1,
      });

      const message = `${product.title} (${selectedVariant.color}, ${selectedSize}) added to cart!`;
      alert(message);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add to cart";
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
          <button onClick={() => navigate("/")} className="mt-4 text-gray-900 font-medium hover:underline">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const images = selectedVariant?.images || [];
  const currentImage = images[currentImageIndex] || product.mainImage || images[0];
  const priceRange = product.priceRange || { min: 0, max: 0 };
  const hasPriceRange = priceRange.min !== priceRange.max;
  const hasBadges = Object.values(product.badges || {}).some((v) => v === true);

  // Optional fields — only render if your product data actually provides them
  const rating = product.rating; // e.g. 4.8
  const reviewCount = product.reviewCount; // e.g. 128
  const compareAtPrice = product.compareAtPrice; // original price before discount
  const currentPrice = selectedVariant?.price?.amount ?? priceRange.min;
  const discountPercent =
    compareAtPrice && compareAtPrice > currentPrice
      ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
      : null;

  const badgeList = [
    product.badges?.freeShipping && {
      icon: Truck,
      label: "Free Shipping",
      caption: "On orders over ₹999",
    },
    product.badges?.sevenDayReturn && {
      icon: RotateCcw,
      label: "Easy Returns",
      caption: "7-day return policy",
    },
    product.badges?.authenticProduct && {
      icon: ShieldCheck,
      label: "Secure Payment",
      caption: "100% secure checkout",
    },
    product.badges?.cashOnDelivery && {
      icon: Wallet,
      label: "Cash on Delivery",
      caption: "Available at your door",
    },
    product.badges?.silkAssured && {
      icon: Sparkles,
      label: "Silk Assured",
      caption: "Quality guaranteed",
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-6"
        >
          <ChevronLeft size={16} />
          Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[88px_1fr_1fr] gap-6">
          {/* Thumbnail rail */}
          {images.length > 1 && (
            <div className="hidden lg:flex flex-col gap-3 order-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition flex-shrink-0 bg-white ${currentImageIndex === index
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="order-2">
            <div className="relative bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden aspect-[4/5]">
              {currentImage ? (
                <img src={currentImage} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <button className="absolute right-4 bottom-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition">
                <ZoomIn size={18} className="text-gray-700" />
              </button>

              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Mobile thumbnails */}
            {images.length > 1 && (
              <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${currentImageIndex === index ? "border-gray-900" : "border-transparent"
                      }`}
                  >
                    <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info column */}
          <div className="order-3 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                {product.subCategory && (
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
                    {product.subCategory}
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-3 leading-tight">
                {product.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">by {product.seller?.fullname || "SILQ"}</p>

              {/* Rating row — only shows if your data provides it */}
              {rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.round(rating) ? "fill-gray-900 text-gray-900" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {rating} {reviewCount ? `(${reviewCount} reviews)` : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2 flex-wrap">
              {hasPriceRange ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">₹{priceRange.min}</span>
                  <span className="text-gray-400 text-xl">–</span>
                  <span className="text-3xl font-bold text-gray-900">₹{priceRange.max}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">₹{priceRange.min}</span>
              )}
              {compareAtPrice && compareAtPrice > currentPrice && (
                <span className="text-lg text-gray-400 line-through">₹{compareAtPrice}</span>
              )}
              {discountPercent && (
                <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            {selectedVariant && hasPriceRange && (
              <p className="text-sm text-gray-500 -mt-3">
                Selected: <span className="font-semibold text-gray-700">₹{selectedVariant.price.amount}</span>
              </p>
            )}

            <hr className="border-gray-200" />

            {/* Color Variants */}
            {product.variants?.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Color: <span className="font-normal text-gray-500">{selectedVariant?.color || "Select"}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => {
                    const isSelected = selectedVariant?.color === variant.color;
                    return (
                      <button
                        key={index}
                        onClick={() => handleVariantSelect(variant)}
                        title={variant.color}
                        className={`w-9 h-9 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${isSelected ? "border-gray-900" : "border-transparent hover:border-gray-300"
                          }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full border border-gray-200"
                          style={{ backgroundColor: variant.colorCode || "#ccc" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.availableSizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Size: <span className="font-normal text-gray-500">{selectedSize || "Select"}</span>
                  </h3>
                  <span className="text-xs text-gray-400 underline cursor-pointer">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 text-gray-700 bg-white hover:border-gray-900"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${selectedVariant?.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
              >
                {selectedVariant?.stock > 0 ? `In Stock (${selectedVariant.stock})` : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || selectedVariant?.stock === 0 || !selectedVariant || !selectedSize}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </button>
              <button className="p-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                <Heart size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Trust Badges — boxed, Flipkart-style */}
            {hasBadges && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {badgeList.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center gap-1.5 border border-gray-200 rounded-xl px-2 py-3 bg-white"
                    >
                      <Icon size={18} className="text-gray-700" />
                      <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-tight">{badge.caption}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="flex gap-6 border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition border-b-2 -mb-px ${activeTab === tab
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pt-5">
              {activeTab === "Details" && (
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              )}
              {activeTab === "Shipping & Returns" && (
                <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
                  {product.badges?.freeShipping && <li>Free shipping on this item.</li>}
                  {product.badges?.sevenDayReturn && <li>7-day return policy.</li>}
                  {product.badges?.cashOnDelivery && <li>Cash on delivery available.</li>}
                  {!hasBadges && <li>Shipping and return details will be shown here.</li>}
                </ul>
              )}
            </div>
          </div>

          {/* Secondary banner image */}
          {images[1] && (
            <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] hidden lg:block">
              <img src={images[1]} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProductDetail;