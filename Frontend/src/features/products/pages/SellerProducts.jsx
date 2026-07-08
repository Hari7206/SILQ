import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteExistingProduct } = useProduct();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Redirect if not seller
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
    return <div className="min-h-screen bg-[#FBF4E8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FBF4E8] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <button onClick={() => navigate("/seller/products/create")} className="bg-[#F5C451] hover:bg-[#f0ba33] text-gray-900 font-semibold px-4 py-2 rounded-lg transition">
            + Add Product
          </button>
        </div>
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No products yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Add Product" to create your first product</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;