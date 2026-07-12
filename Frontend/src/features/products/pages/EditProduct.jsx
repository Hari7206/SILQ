import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import ProductForm from "../components/ProductForm";
import { ChevronRight } from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F5C451] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F1] w-full">
      <div className="max-w-[1440px] mx-auto px-8 py-8 w-full">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <span>Products</span>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Edit product</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit product</h1>
            <p className="text-sm text-gray-400">Update your product details</p>
          </div>
        </div>

        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          loading={loading}
          buttonText="Update Product"
          error={error}
        />
      </div>
    </div>
  );
};

export default EditProduct;