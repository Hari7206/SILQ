import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import PublicProductCard from "../components/PublicProductCard";


const PublicProducts = () => {
  const { fetchPublicProducts, products, loading } = useProduct();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [matchedColors, setMatchedColors] = useState({});
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    fetchPublicProducts();
  }, []);

useEffect(() => {
  if (products.length === 0) {
    setFilteredProducts([]);
    setMatchedColors({});
    return;
  }

  const query = searchTerm.toLowerCase().trim();

  if (!query) {
    setFilteredProducts(products);
    setMatchedColors({});
    return;
  }

  const words = query.split(" ").filter((w) => w.length > 0);
  const matched = [];
  const colorMap = {};

  products.forEach((product) => {
    let match = false;
    let matchedColor = null;

    // ✅ Check if ALL words match ANY field
    const allWordsMatch = words.every((word) => {
      // Check title
      if (product.title?.toLowerCase().includes(word)) return true;
      // Check category
      if (product.category?.toLowerCase().includes(word)) return true;
      // Check subCategory
      if (product.subCategory?.toLowerCase().includes(word)) return true;
      // Check gender
      if (product.gender?.toLowerCase().includes(word)) return true;
      // Check variant colors
      if (product.variants?.some((v) => v.color?.toLowerCase().includes(word))) {
        return true;
      }
      return false;
    });

    if (allWordsMatch) {
      match = true;
      // Find which color matched (for highlight)
      for (const word of words) {
        const foundVariant = product.variants?.find((v) =>
          v.color?.toLowerCase().includes(word)
        );
        if (foundVariant) {
          matchedColor = foundVariant.color;
          break;
        }
      }
    }

    if (match) {
      matched.push(product);
      if (matchedColor) {
        colorMap[product._id] = matchedColor;
      }
    }
  });

  setFilteredProducts(matched);
  setMatchedColors(colorMap);
}, [products, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
     

      <div className="bg-white border-b border-gray-200 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900">
            Shop SILQ
          </h1>
          <p className="text-gray-500 mt-2">
            {searchTerm ? (
              <>
                Showing results for <span className="font-medium text-gray-700">"{searchTerm}"</span>
                <span className="text-gray-400 ml-2">
                  ({filteredProducts.length} products found)
                </span>
              </>
            ) : (
              "Discover our curated collection"
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isFiltering ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#F5C451] rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm mt-4">Searching...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            {searchTerm && <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <PublicProductCard
                key={product._id}
                product={product}
                highlightColor={matchedColors[product._id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProducts;