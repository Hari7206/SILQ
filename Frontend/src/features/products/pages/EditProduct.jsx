import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import ProductForm from "../components/ProductForm";
import { ChevronLeft, ChevronRight, Trash2, UploadCloud, X, Image as ImageIcon } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, updateExistingProduct, loading, error, product, resetProductState } = useProduct();
  const user = useSelector((state) => state.auth.user);

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    if (user && user.role !== "seller") {
      navigate("/");
      return;
    }
    fetchProductById(id);
    return () => resetProductState();
  }, [id]);

  const handleSubmit = async (formData) => {
    const jsonData = {};
    for (const [key, value] of formData.entries()) {
      if (key === "images" || key.startsWith("altTexts")) continue;
      
      if (key === "availableSizes") {
        jsonData[key] = JSON.parse(value);
      } else if (key === "colors") {
        jsonData[key] = value ? JSON.parse(value) : [];
      } else if (key === "occasion") {
        jsonData[key] = value ? JSON.parse(value) : [];
      } else if (key === "priceAmount") {
        jsonData.price = { ...jsonData.price, amount: parseFloat(value) };
      } else if (key === "priceCurrency") {
        jsonData.price = { ...jsonData.price, currency: value };
      } else if (key === "stock") {
        jsonData[key] = parseFloat(value);
      } else if (key === "isActive") {
        jsonData[key] = value === "true";
      } else {
        jsonData[key] = value;
      }
    }

    await updateExistingProduct(id, jsonData);
    navigate("/seller/products");
  };

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

  const handleDeleteImage = async (imageUrl) => {
    try {
      await fetch(`http://localhost:3000/api/products/${id}/remove-image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageUrl }),
      });
      await fetchProductById(id);
      setShowDeleteConfirm(false);
      setImageToDelete(null);
      setCurrentImageIndex(0); // Reset index in case we deleted the last one
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Fetching product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <button onClick={() => navigate("/seller/products")} className="hover:text-indigo-600 transition-colors">
                Inventory
              </button>
              <span>/</span>
              <span>Products</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Edit Product
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
              ID: {id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Media Management (SaaS Style) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <ImageIcon size={18} className="text-indigo-500" />
                  Media Gallery
                </h2>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  {product?.images?.length || 0} Files
                </span>
              </div>

              {/* Main Preview */}
              <div className="relative bg-slate-50 aspect-square group">
                {product?.images?.length > 0 ? (
                  <>
                    <img
                      src={product.images[currentImageIndex].url}
                      alt={product.images[currentImageIndex].alt}
                      className="w-full h-full object-contain p-4"
                    />
                    
                    {/* Floating Controls */}
                    <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={prevImage}
                        className="w-8 h-8 bg-white/90 backdrop-blur shadow-md text-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="w-8 h-8 bg-white/90 backdrop-blur shadow-md text-slate-700 rounded-full flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setImageToDelete(product.images[currentImageIndex].url);
                        setShowDeleteConfirm(true);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur shadow-sm text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon size={48} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">No media uploaded</p>
                  </div>
                )}
              </div>

              {/* Horizontal Thumbnails below main image */}
              {product?.images?.length > 0 && (
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {product.images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all ${
                          currentImageIndex === index 
                            ? "ring-2 ring-indigo-600 ring-offset-2" 
                            : "ring-1 ring-slate-200 hover:ring-slate-400"
                        }`}
                      >
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SaaS Style Upload Dropzone */}
            <label className="flex flex-col items-center justify-center w-full p-8 bg-white border-2 border-dashed border-indigo-200 rounded-2xl hover:bg-indigo-50/50 hover:border-indigo-400 transition-all cursor-pointer shadow-sm group">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
              </div>
              <span className="text-sm font-semibold text-indigo-900">Click to upload media</span>
              <span className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if (files.length > 0) {
                    const formData = new FormData();
                    for (const file of files) {
                      formData.append("images", file);
                    }
                    await fetch(`http://localhost:3000/api/products/${id}/add-images`, {
                      method: "PUT",
                      credentials: "include",
                      body: formData,
                    });
                    await fetchProductById(id);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Right Column: Form Data */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Product Information</h2>
                <p className="text-sm text-slate-500 mt-1">Update the core details and variants for this item.</p>
              </div>
              
              <ProductForm
                initialData={product}
                onSubmit={handleSubmit}
                loading={loading}
                buttonText="Save Changes"
                error={error}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Modern iOS/SaaS Style Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden transform transition-all">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Media</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to remove this image? This action cannot be undone and will update the live product.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteImage(imageToDelete)}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;