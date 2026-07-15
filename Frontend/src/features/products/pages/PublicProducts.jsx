import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import PublicProductCard from "../components/PublicProductCard";
import Navbar from "../../../components/Navbar/Navbar";

const PublicProducts = () => {
  const { fetchPublicProducts, products, loading } = useProduct();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const genderFilter = searchParams.get("gender") || "";
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [matchedColors, setMatchedColors] = useState({});

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
    const matched = [];
    const colorMap = {};

    products.forEach((product) => {
      // 1. Gender Filter Check
      if (genderFilter && product.gender?.toLowerCase() !== genderFilter.toLowerCase()) {
        return; 
      }

      // 2. Search Filter Check
      if (!query) {
        // If there is no search query, everything that passed the gender check is valid
        matched.push(product);
        return;
      }

      const words = query.split(" ").filter((w) => w.length > 0);
      let match = false;
      let matchedColor = null;

      // Check if ANY word matches a variant color
      for (const word of words) {
        const foundVariant = product.variants?.find((v) =>
          v.color?.toLowerCase().includes(word)
        );
        if (foundVariant) {
          match = true;
          matchedColor = foundVariant.color;
          break;
        }
      }

      // If no color match, check title/category
      if (!match) {
        for (const word of words) {
          if (product.title?.toLowerCase().includes(word)) {
            match = true;
            break;
          }
          if (product.category?.toLowerCase().includes(word)) {
            match = true;
            break;
          }
          if (product.subCategory?.toLowerCase().includes(word)) {
            match = true;
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
  }, [products, searchTerm, genderFilter]);

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
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900">
            Shop SILQ
          </h1>
          <p className="text-gray-500 mt-2">
            {searchTerm || genderFilter ? (
              <>
                Showing results for{" "}
                {genderFilter && (
                  <span className="font-medium text-gray-700 capitalize mr-1">
                    {genderFilter}'s
                  </span>
                )}
                {searchTerm && (
                  <>
                    <span className="text-gray-500">Search: </span>
                    <span className="font-medium text-gray-700">"{searchTerm}"</span>
                  </>
                )}
              </>
            ) : (
              "Discover our curated collection"
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            {(searchTerm || genderFilter) && (
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search</p>
            )}
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