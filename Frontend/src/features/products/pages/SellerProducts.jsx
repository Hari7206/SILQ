import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteExistingProduct } = useProduct();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.role !== "seller") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteExistingProduct(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F5C451] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F1] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <button
            onClick={() => navigate("/seller/products/create")}
            className="bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No products yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Add Product" to create your first product</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const mainImage = product.mainImage || product.variants?.[0]?.images?.[0];
              const priceRange = product.priceRange || { min: 0, max: 0 };
              
              return (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="h-48 bg-gray-100">
                    {mainImage ? (
                      <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    {priceRange.min > 0 && (
                      <p className="text-lg font-bold text-gray-900 mt-1">₹{priceRange.min}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/seller/products/edit/${product._id}`)}
                        className="flex-1 bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-medium py-1.5 rounded transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 rounded transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;