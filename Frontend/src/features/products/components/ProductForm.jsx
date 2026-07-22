
import { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronDown, ChevronUp, Image as ImageIcon, Upload } from "lucide-react";

const ProductForm = ({ initialData, onSubmit, loading, buttonText, error }) => {
  const defaultFormData = {
    title: "",
    description: "",
    category: "",
    subCategory: "",
    gender: "Men",
    brand: "",
    tags: "",
    weight: "",
    weightUnit: "kg",
    countryOfOrigin: "India",
    careInstructions: "",
    seoTitle: "",
    seoDescription: "",
    availableSizes: [],
    fabric: "",
    occasion: "",
    isActive: true,
    isFeatured: false,
    badges: {
      sevenDayReturn: false,
      cashOnDelivery: false,
      silkAssured: false,
      freeShipping: false,
      authenticProduct: false,
    },
    variants: [
      {
        color: "",
        colorCode: "",
        mrp: { amount: "", currency: "INR" },
        price: { amount: "", currency: "INR" },
        stock: "",
        images: [],
        sku: "",
        isActive: true,
      },
    ],
  };

  const populateFormData = (data) => {
    if (!data) return defaultFormData;
    
    return {
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      subCategory: data.subCategory || "",
      gender: data.gender || "Men",
      brand: data.brand || "",
      tags: data.tags?.join(", ") || "",
      weight: data.weight?.value || "",
      weightUnit: data.weight?.unit || "kg",
      countryOfOrigin: data.countryOfOrigin || "India",
      careInstructions: data.careInstructions?.join(", ") || "",
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      availableSizes: data.availableSizes || [],
      fabric: data.fabric || "",
      occasion: data.occasion?.join(", ") || "",
      isActive: data.isActive !== undefined ? data.isActive : true,
      isFeatured: data.isFeatured || false,
      badges: {
        sevenDayReturn: data.badges?.sevenDayReturn || false,
        cashOnDelivery: data.badges?.cashOnDelivery || false,
        silkAssured: data.badges?.silkAssured || false,
        freeShipping: data.badges?.freeShipping || false,
        authenticProduct: data.badges?.authenticProduct || false,
      },
      variants: data.variants && data.variants.length > 0 ? data.variants.map(v => ({
        ...v,
        mrp: v.mrp || { amount: "", currency: "INR" },
        price: v.price || { amount: "", currency: "INR" },
      })) : [
        {
          color: "",
          colorCode: "",
          mrp: { amount: "", currency: "INR" },
          price: { amount: "", currency: "INR" },
          stock: "",
          images: [],
          sku: "",
          isActive: true,
        },
      ],
    };
  };

  const [formData, setFormData] = useState(populateFormData(initialData));
  const [expandedVariant, setExpandedVariant] = useState(0);
  const [variantImagePreviews, setVariantImagePreviews] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});

  const fileInputRefs = useRef({});

  useEffect(() => {
    if (initialData) {
      const newData = populateFormData(initialData);
      setFormData(newData);
    }
  }, [initialData]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const currencyOptions = ["INR", "USD", "EUR", "GBP"];
  const weightUnitOptions = ["kg", "g", "lb", "oz"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBadgeChange = (badgeName) => {
    setFormData((prev) => ({
      ...prev,
      badges: {
        ...prev.badges,
        [badgeName]: !prev.badges[badgeName],
      },
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

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    const variantCopy = { ...newVariants[index] };
    
    if (field === "mrpAmount") {
      variantCopy.mrp = { 
        ...variantCopy.mrp, 
        amount: value 
      };
    } else if (field === "mrpCurrency") {
      variantCopy.mrp = { 
        ...variantCopy.mrp, 
        currency: value 
      };
    } else if (field === "priceAmount") {
      variantCopy.price = { 
        ...variantCopy.price, 
        amount: value 
      };
    } else if (field === "priceCurrency") {
      variantCopy.price = { 
        ...variantCopy.price, 
        currency: value 
      };
    } else {
      variantCopy[field] = value;
    }
    
    newVariants[index] = variantCopy;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          colorCode: "",
          mrp: { amount: "", currency: "INR" },
          price: { amount: "", currency: "INR" },
          stock: "",
          images: [],
          sku: "",
          isActive: true,
        },
      ],
    }));
    setExpandedVariant(formData.variants.length);
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) {
      alert("Product must have at least one variant");
      return;
    }
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, variants: newVariants }));
    if (expandedVariant >= newVariants.length) {
      setExpandedVariant(newVariants.length - 1);
    }
  };

  const handleVariantImageUpload = async (index, files) => {
    const fileArray = Array.from(files).slice(0, 5 - formData.variants[index].images.length);
    
    if (fileArray.length === 0) return;

    setUploadingImages((prev) => ({ ...prev, [index]: true }));

    const newVariants = [...formData.variants];
    const newPreviews = [];

    for (const file of fileArray) {
      const preview = URL.createObjectURL(file);
      newPreviews.push(preview);

      const url = await uploadToCloudinary(file);
      if (url) {
        const variantCopy = { ...newVariants[index] };
        variantCopy.images = [...variantCopy.images, url];
        newVariants[index] = variantCopy;
      }
    }

    setVariantImagePreviews((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), ...newPreviews],
    }));

    setFormData((prev) => ({ ...prev, variants: newVariants }));
    setUploadingImages((prev) => ({ ...prev, [index]: false }));
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const newVariants = [...formData.variants];
    const variantCopy = { ...newVariants[variantIndex] };
    variantCopy.images = variantCopy.images.filter((_, i) => i !== imageIndex);
    newVariants[variantIndex] = variantCopy;
    
    setVariantImagePreviews((prev) => ({
      ...prev,
      [variantIndex]: prev[variantIndex]?.filter((_, i) => i !== imageIndex) || [],
    }));
    
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate variants
  for (const variant of formData.variants) {
    if (!variant.color || !variant.mrp?.amount || !variant.price?.amount || !variant.stock) {
      alert("Each variant must have color, MRP, price, and stock");
      return;
    }
  }

  const formDataToSend = new FormData();

  // Handle regular fields
  Object.keys(formData).forEach((key) => {
    if (key === "variants" || key === "badges" || key === "availableSizes") return;
    if (key === "occasion" || key === "tags" || key === "careInstructions") {
      const value = formData[key] ? JSON.stringify(formData[key].split(",").map((s) => s.trim()).filter(Boolean)) : JSON.stringify([]);
      formDataToSend.append(key, value);
    } else if (key === "weight") {
      // FIX: Send weight as JSON string
      formDataToSend.append("weight", JSON.stringify({ 
        value: parseFloat(formData[key]) || 0, 
        unit: formData.weightUnit || "kg" 
      }));
    } else if (key === "weightUnit") {
      // Skip this - it's handled above
      return;
    } else {
      formDataToSend.append(key, formData[key]);
    }
  });

  formDataToSend.append("availableSizes", JSON.stringify(formData.availableSizes));
  formDataToSend.append("badges", JSON.stringify(formData.badges));

  // Handle variants
  const variantsToSend = formData.variants.map((v) => ({
    ...v,
    mrp: {
      amount: parseFloat(v.mrp.amount),
      currency: v.mrp.currency || "INR",
    },
    price: {
      amount: parseFloat(v.price.amount),
      currency: v.price.currency || "INR",
    },
    stock: parseInt(v.stock) || 0,
    images: v.images || [],
  }));
  formDataToSend.append("variants", JSON.stringify(variantsToSend));

  await onSubmit(formDataToSend);
};

  const inputClass =
    "w-full border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#F5C451]/40 focus:border-[#F5C451] outline-none transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">General Information</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Premium Silk Kurta"
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
              placeholder="Describe your product in detail..."
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Kurtas, Sarees, Sherwanis"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Sub Category</label>
            <input
              type="text"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="e.g., Men's Wedding Kurtas"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., SILQ Heritage"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Variants (Color, MRP, Price, Stock) *</h3>
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            <Plus size={14} /> Add Variant
          </button>
        </div>

        {formData.variants.map((variant, index) => (
          <div
            key={index}
            className={`border rounded-xl p-4 mb-3 transition ${index === expandedVariant ? "border-indigo-300 bg-indigo-50/30" : "border-gray-200"}`}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedVariant(index === expandedVariant ? -1 : index)}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Variant {index + 1}
                </span>
                {variant.color && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-700">
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.colorCode || "#ccc" }}
                    />
                    {variant.color}
                  </span>
                )}
                {variant.price.amount && (
                  <span className="text-xs text-gray-500">₹{variant.price.amount}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVariant(index);
                  }}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <X size={16} />
                </button>
                {index === expandedVariant ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {index === expandedVariant && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Color Name *</label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      placeholder="e.g., Maroon"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Color Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={variant.colorCode}
                        onChange={(e) => handleVariantChange(index, "colorCode", e.target.value)}
                        placeholder="#800000"
                        className={inputClass}
                      />
                      {variant.colorCode && (
                        <span
                          className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: variant.colorCode }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">MRP *</label>
                    <input
                      type="number"
                      value={variant.mrp.amount}
                      onChange={(e) => handleVariantChange(index, "mrpAmount", e.target.value)}
                      placeholder="0"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Currency</label>
                    <select
                      value={variant.mrp.currency}
                      onChange={(e) => handleVariantChange(index, "mrpCurrency", e.target.value)}
                      className={inputClass}
                    >
                      {currencyOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Price *</label>
                    <input
                      type="number"
                      value={variant.price.amount}
                      onChange={(e) => handleVariantChange(index, "priceAmount", e.target.value)}
                      placeholder="0"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Currency</label>
                    <select
                      value={variant.price.currency}
                      onChange={(e) => handleVariantChange(index, "priceCurrency", e.target.value)}
                      className={inputClass}
                    >
                      {currencyOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Stock *</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                      placeholder="0"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">SKU (Optional)</label>
                    <input
                      type="text"
                      value={variant.sku || ""}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      placeholder="SKU-001"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Images (max 5)</label>
                  <div className="mt-2">
                    {variant.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {variant.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                              {variantImagePreviews[index]?.[imgIndex] ? (
                                <img
                                  src={variantImagePreviews[index][imgIndex]}
                                  alt={`${variant.color} - ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index, imgIndex)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition shadow-md"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {variant.images.length < 5 && (
                      <label className={`flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer transition ${
                        uploadingImages[index] 
                          ? "border-indigo-300 bg-indigo-50/40" 
                          : "border-gray-200 hover:border-[#F5C451] hover:bg-[#FDF7E8]/40"
                      }`}>
                        <div className="flex flex-col items-center gap-1">
                          {uploadingImages[index] ? (
                            <>
                              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs text-indigo-500">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={16} className="text-gray-400" />
                              <span className="text-xs text-gray-400">Upload image</span>
                            </>
                          )}
                        </div>
                        <input
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploadingImages[index]}
                          onChange={(e) => {
                            if (e.target.files.length > 0) {
                              handleVariantImageUpload(index, e.target.files);
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {variant.images.length}/5 images
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Available Sizes</h3>
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Additional Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fabric</label>
            <input
              type="text"
              name="fabric"
              value={formData.fabric}
              onChange={handleChange}
              placeholder="e.g., Silk, Cotton"
              className={inputClass}
            />
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
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="silk, handcrafted, wedding"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Country of Origin</label>
            <input
              type="text"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              placeholder="India"
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Weight</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="0.5"
                className={`${inputClass} flex-1`}
              />
              <div className="flex-shrink-0">
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleChange}
                  className={`${inputClass} w-20`}
                >
                  {weightUnitOptions.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Care Instructions</label>
            <input
              type="text"
              name="careInstructions"
              value={formData.careInstructions}
              onChange={handleChange}
              placeholder="Dry clean only, Store in cool place"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">SEO</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder="Buy Premium Silk Kurta Online | SILQ"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea
              name="seoDescription"
              rows="2"
              value={formData.seoDescription}
              onChange={handleChange}
              placeholder="Handcrafted pure silk kurta for weddings and festivals..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Trust Badges</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "sevenDayReturn", label: "7-Day Return" },
            { key: "cashOnDelivery", label: "Cash on Delivery" },
            { key: "silkAssured", label: "Silk Assured" },
            { key: "freeShipping", label: "Free Shipping" },
            { key: "authenticProduct", label: "Authentic Product" },
          ].map((badge) => (
            <label key={badge.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.badges[badge.key]}
                onChange={() => handleBadgeChange(badge.key)}
                className="accent-[#F5C451] w-4 h-4"
              />
              {badge.label}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Status</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="accent-[#F5C451] w-4 h-4"
            />
            Product is Active
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="accent-[#F5C451] w-4 h-4"
            />
            Featured Product
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold py-3.5 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "Processing..." : buttonText}
      </button>
    </form>
  );
};

export default ProductForm;
