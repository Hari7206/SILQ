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
    await updateExistingProduct(id, formData);
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