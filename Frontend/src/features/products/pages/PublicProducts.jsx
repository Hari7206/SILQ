import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import PublicProductCard from "../components/PublicProductCard";
import Navbar from "../../../components/Navbar/Navbar";

const PublicProducts = () => {
  const { fetchPublicProducts, products, loading } = useProduct();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchPublicProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4 font-['Inter',sans-serif]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 font-['Playfair_Display',serif]">
            Shop SILQ
          </h1>
          <p className="text-gray-500 mt-2">
            {searchTerm ? (
              <>
                Showing results for <span className="font-medium text-gray-700">"{searchTerm}"</span>
              </>
            ) : (
              "Discover our curated collection"
            )}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            {searchTerm && <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <PublicProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProducts;