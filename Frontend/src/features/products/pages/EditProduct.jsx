import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import ProductForm from "../components/ProductForm";

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
  // Convert FormData to JSON object
  const jsonData = {};
  
  // Get all form fields except images
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
    } else if (key === "stock" || key === "priceAmount") {
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
    return <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FBF4E8] p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
        <ProductForm initialData={product} onSubmit={handleSubmit} loading={loading} buttonText="Update Product" error={error} />
      </div>
    </div>
  );
};

export default EditProduct;