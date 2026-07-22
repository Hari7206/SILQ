import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import ProductForm from "../components/ProductForm";
import { ChevronRight, ArrowLeft, Sparkles, Sliders, ShieldCheck } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, updateExistingProduct, loading, error, product, resetProductState } = useProduct();
  const user = useSelector((state) => state.auth.user);

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
      // Skip images and altTexts (handled separately)
      if (key === "images" || key.startsWith("altTexts")) continue;
      
      // Parse JSON fields
      if (key === "availableSizes") {
        try {
          jsonData[key] = JSON.parse(value);
        } catch {
          jsonData[key] = [];
        }
      } else if (key === "occasion") {
        try {
          jsonData[key] = JSON.parse(value);
        } catch {
          jsonData[key] = [];
        }
      } else if (key === "tags") {
        try {
          jsonData[key] = JSON.parse(value);
        } catch {
          jsonData[key] = [];
        }
      } else if (key === "careInstructions") {
        try {
          jsonData[key] = JSON.parse(value);
        } catch {
          jsonData[key] = [];
        }
      } else if (key === "badges") {
        try {
          jsonData[key] = JSON.parse(value);
        } catch {
          jsonData[key] = {};
        }
      } else if (key === "originalPrice") {
        jsonData.originalPrice = {
          amount: parseFloat(value) || 0,
          currency: "INR",
        };
      } else if (key === "sellingPrice") {
        jsonData.sellingPrice = {
          amount: parseFloat(value) || 0,
          currency: "INR",
        };
      } else if (key === "weight") {
        jsonData.weight = {
          value: parseFloat(value) || 0,
          unit: formData.get("weightUnit") || "kg",
        };
      } else if (key === "weightUnit") {
        // Skip - handled in weight above
        continue;
      } else if (key === "stock") {
        jsonData[key] = parseFloat(value) || 0;
      } else if (key === "priceAmount") {
        // Handle variant price separately
        jsonData.price = { ...jsonData.price, amount: parseFloat(value) || 0 };
      } else if (key === "priceCurrency") {
        jsonData.price = { ...jsonData.price, currency: value || "INR" };
      } else if (key === "isActive") {
        jsonData[key] = value === "true";
      } else if (key === "isFeatured") {
        jsonData[key] = value === "true";
      } else {
        // Regular fields
        if (value !== undefined && value !== null && value !== "") {
          jsonData[key] = value;
        }
      }
    }

    // Handle variants separately
    const variantsValue = formData.get("variants");
    if (variantsValue) {
      try {
        jsonData.variants = JSON.parse(variantsValue);
      } catch {
        // Keep existing variants if parse fails
      }
    }

    await updateExistingProduct(id, jsonData);
    navigate("/seller/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-[#F5C451]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#F5C451] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-gray-900 tracking-tight">Retrieving Workspace Data</p>
          <p className="text-xs text-gray-400">Please hold while we compile listing files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] w-full text-gray-900 selection:bg-[#F5C451]/20 selection:text-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-gray-200/60">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <button 
                onClick={() => navigate("/seller/products")} 
                className="hover:text-gray-900 transition flex items-center gap-1"
              >
                Dashboard
              </button>
              <ChevronRight size={10} strokeWidth={3} className="text-gray-300" />
              <button 
                onClick={() => navigate("/seller/products")} 
                className="hover:text-gray-900 transition"
              >
                Inventory
              </button>
              <ChevronRight size={10} strokeWidth={3} className="text-gray-300" />
              <span className="text-[#F5C451]">Modify Listing</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/seller/products")}
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm active:scale-95"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">Edit Inventory Item</h1>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Refine variations, pricing updates, and global information stacks.</p>
              </div>
            </div>
          </div>

          {product && (
            <div className="flex items-center gap-2 self-start md:self-center bg-white px-3.5 py-2 rounded-xl border border-gray-100 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-gray-300"}`}></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Live Status: {product.isActive ? "Active Matrix" : "Archived Matrix"}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {product ? (
              <ProductForm
                key={product._id}
                initialData={product}
                onSubmit={handleSubmit}
                loading={loading}
                buttonText="Commit Inventory Changes"
                error={error}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-[#F5C451] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading product data...</p>
              </div>
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bg-white border border-gray-100 rounded-[1.75rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 rounded-xl bg-[#F5C451]/10 flex items-center justify-center text-[#f2b935] mb-4">
                <Sparkles size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Interactive Management</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Modifying parameters here will propagate calculations system-wide instantly. Ensure internal SKU codes align to structural warehouse protocols to mitigate syncing issues.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[1.75rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4">
                <Sliders size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Variation Stacking</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Keep target color profiles optimized by providing accurate hexadecimal strings. Rich variant matrices offer higher structural checkout rates across frontend interfaces.
              </p>
            </div>

            <div className="bg-gray-900 text-white rounded-[1.75rem] p-6 border border-gray-800 shadow-xl relative overflow-hidden group">
              <div className="absolute right-[-20px] bottom-[-20px] text-gray-800/40 transform -rotate-12 transition-transform duration-500 group-hover:scale-110">
                <ShieldCheck size={140} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[#F5C451] text-[10px] font-bold tracking-wider uppercase">
                  <ShieldCheck size={12} /> Secure Configuration Layer
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Encrypted Submissions</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    All transaction structural revisions undergo validation against secure vendor validation protocols before pipeline entry to maintain integrity records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditProduct;