import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronRight, Plus } from "lucide-react";
import { useProduct } from "../hook/useProduct";
import ProductForm from "../components/ProductForm";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { createNewProduct, loading, error, resetProductState } = useProduct();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.role !== "seller") {
      navigate("/");
      return;
    }
    resetProductState();
  }, []);

  const handleSubmit = async (formData) => {
    await createNewProduct(formData);
    navigate("/seller/products");
  };

  return (
    <div className="min-h-screen bg-[#F7F5F1] w-full">
      <div className="max-w-[1440px] mx-auto px-8 py-8 w-full">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <span>Products</span>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">New product</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <Plus size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create new product</h1>
              <p className="text-sm text-gray-400">Fill in the details to list it in your store</p>
            </div>
          </div>
        </div>

        <ProductForm
          onSubmit={handleSubmit}
          loading={loading}
          buttonText="Create product"
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateProduct;