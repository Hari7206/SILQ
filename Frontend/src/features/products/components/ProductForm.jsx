import { useState } from "react";
import {
  Info,
  Tag,
  Ruler,
  Package,
  ImagePlus,
  X,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";

const ProductForm = ({ initialData, onSubmit, loading, buttonText, error }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priceAmount: initialData?.price?.amount || "",
    priceCurrency: initialData?.price?.currency || "INR",
    category: initialData?.category || "",
    subCategory: initialData?.subCategory || "",
    availableSizes: initialData?.availableSizes || [],
    colors: initialData?.colors?.join(", ") || "",
    fabric: initialData?.fabric || "",
    occasion: initialData?.occasion?.join(", ") || "",
    stock: initialData?.stock || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const currencyOptions = ["INR", "USD", "EUR", "GBP"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter((s) => s !== size)
        : [...prev.availableSizes, size],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "availableSizes") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === "colors" || key === "occasion") {
        const value = formData[key]
          ? JSON.stringify(formData[key].split(",").map((s) => s.trim()).filter(Boolean))
          : JSON.stringify([]);
        formDataToSend.append(key, value);
      } else if (key === "priceAmount" || key === "stock") {
        formDataToSend.append(key, String(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append("isActive", String(formData.isActive));

    images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    images.forEach((_, index) => {
      formDataToSend.append(`altTexts[${index}]`, `${formData.title} - Image ${index + 1}`);
    });

    onSubmit(formDataToSend);
  };

  // Shared field styles
  const inputClass =
    "w-full border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#F5C451]/40 focus:border-[#F5C451] outline-none transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  const SectionCard = ({ icon: Icon, title, subtitle, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#FDF3DC] flex items-center justify-center flex-shrink-0">
          <Icon size={17} className="text-[#B8860B]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <SectionCard icon={Info} title="General information" subtitle="Basic details buyers see first">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Handwoven Silk Saree"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the product, its craft, and what makes it special."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Tag} title="Pricing & category" subtitle="Where it's priced and listed">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Price *</label>
                <input
                  type="number"
                  name="priceAmount"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {currencyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Kurtas, Sarees"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sub category</label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  placeholder="e.g., Men's Wedding Kurtas"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="Units available"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Ruler} title="Variants & attributes" subtitle="Sizes, colors, fabric, and occasion">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Available sizes</label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => {
                  const active = formData.availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`w-11 h-9 rounded-lg text-sm font-medium border transition ${
                        active
                          ? "bg-[#F5C451] border-[#F5C451] text-gray-900"
                          : "bg-gray-50/60 border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Colors</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="Maroon, Navy Blue"
                  className={inputClass}
                />
                <p className="text-[11px] text-gray-400 mt-1">Comma separated</p>
              </div>
              <div>
                <label className={labelClass}>Fabric</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  placeholder="Silk, Cotton, Linen"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Occasion</label>
              <input
                type="text"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                placeholder="Wedding, Festival, Party"
                className={inputClass}
              />
              <p className="text-[11px] text-gray-400 mt-1">Comma separated</p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Status</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isActive: true }))}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition ${
                formData.isActive
                  ? "border-[#F5C451] bg-[#FDF7E8]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">Active</p>
                <p className="text-xs text-gray-400">Visible to buyers immediately</p>
              </div>
              {formData.isActive ? (
                <CheckCircle2 size={18} className="text-[#B8860B] flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-gray-300 flex-shrink-0" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isActive: false }))}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition ${
                !formData.isActive
                  ? "border-[#F5C451] bg-[#FDF7E8]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">Draft</p>
                <p className="text-xs text-gray-400">Keep it hidden until you're ready</p>
              </div>
              {!formData.isActive ? (
                <CheckCircle2 size={18} className="text-[#B8860B] flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-gray-300 flex-shrink-0" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#FDF3DC] flex items-center justify-center flex-shrink-0">
              <ImagePlus size={17} className="text-[#B8860B]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Product images</h3>
              <p className="text-xs text-gray-400">Up to 5 images</p>
            </div>
          </div>

          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-[#F5C451] hover:bg-[#FDF7E8]/40 transition">
            <ImagePlus size={22} className="text-gray-300" />
            <span className="text-xs text-gray-400 text-center px-4">
              Click to upload JPEG or PNG files
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold text-sm py-3.5 rounded-xl transition disabled:opacity-50 shadow-sm"
        >
          <Package size={16} />
          {loading ? "Processing..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;