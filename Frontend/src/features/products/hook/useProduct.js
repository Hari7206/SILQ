// hooks/useProduct.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useRef } from "react";
import {
  setLoading,
  setError,
  setProducts,
  setProduct,
  addProduct,
  updateProduct,
  removeProduct,
  clearSuccess,
  resetProduct,
} from "../state/product.slice";
import {
  getProducts as getProductsAPI,
  getProductById as getProductByIdAPI,
  createProduct as createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
  addProductImages as addProductImagesAPI,
  removeProductImage as removeProductImageAPI,
  getPublicProducts as getPublicProductsAPI,
  getPublicProductById as getPublicProductByIdAPI,
  getRelatedProducts as getRelatedProductsAPI,
  getPublicProductBySlug as getPublicProductBySlugAPI,
} from "../service/product.api";

export const useProduct = () => {
  const dispatch = useDispatch();
  const { products, product, loading, error, success } = useSelector(
    (state) => state.products
  );

  // ✅ Cache for related products
  const relatedCacheRef = useRef(new Map());
  const fetchingRef = useRef(false);

  const fetchPublicProductBySlug = useCallback(async (slug) => {
    if (fetchingRef.current) {
      return;
    }
    
    fetchingRef.current = true;
    try {
      dispatch(setLoading(true));
      const data = await getPublicProductBySlugAPI(slug);
      dispatch(setProduct(data.product));
      dispatch(setLoading(false));
      fetchingRef.current = false;
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch product"));
      dispatch(setLoading(false));
      fetchingRef.current = false;
      throw error;
    }
  }, [dispatch]);

  const fetchPublicProductById = useCallback(async (id) => {
    if (fetchingRef.current) {
      return;
    }
    
    fetchingRef.current = true;
    try {
      dispatch(setLoading(true));
      const data = await getPublicProductByIdAPI(id);
      dispatch(setProduct(data.product));
      dispatch(setLoading(false));
      fetchingRef.current = false;
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch product"));
      dispatch(setLoading(false));
      fetchingRef.current = false;
      throw error;
    }
  }, [dispatch]);

  const fetchPublicProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getPublicProductsAPI();
      dispatch(setProducts(data.products));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch products"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getProductsAPI();
      dispatch(setProducts(data.products));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch products"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  const fetchProductById = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await getProductByIdAPI(id);
      dispatch(setProduct(data.product));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch product"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  // ✅ UPDATED: fetchRelatedProducts with cache
  const fetchRelatedProducts = useCallback(async (id, limit = 8) => {
    try {
      // Check cache first
      const cacheKey = `${id}-${limit}`;
      if (relatedCacheRef.current.has(cacheKey)) {
        console.log("📦 Using cached related products for:", id);
        return relatedCacheRef.current.get(cacheKey);
      }
      
      console.log("🔄 Fetching related products for:", id);
      const data = await getRelatedProductsAPI(id, limit);
      const products = data.products || [];
      
      // Store in cache
      relatedCacheRef.current.set(cacheKey, products);
      
      return products;
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      return [];
    }
  }, []);

  // ✅ Clear cache when needed
  const clearRelatedCache = useCallback(() => {
    relatedCacheRef.current.clear();
  }, []);

  const createNewProduct = useCallback(async (formData) => {
    try {
      dispatch(setLoading(true));
      const data = await createProductAPI(formData);
      dispatch(addProduct(data.product));
      dispatch(setLoading(false));
      // Clear cache when new product is created
      relatedCacheRef.current.clear();
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to create product"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  const updateExistingProduct = useCallback(async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const data = await updateProductAPI(id, formData);
      dispatch(updateProduct(data.product));
      dispatch(setLoading(false));
      // Clear cache when product is updated
      relatedCacheRef.current.clear();
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to update product"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  const deleteExistingProduct = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      await deleteProductAPI(id);
      dispatch(removeProduct(id));
      dispatch(setLoading(false));
      // Clear cache when product is deleted
      relatedCacheRef.current.clear();
      return { success: true };
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to delete product"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  const addMoreImages = useCallback(async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const data = await addProductImagesAPI(id, formData);
      dispatch(updateProduct(data.product));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to add images"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  const removeImage = useCallback(async (id, imageUrl) => {
    try {
      dispatch(setLoading(true));
      const data = await removeProductImageAPI(id, imageUrl);
      dispatch(updateProduct(data.product));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to remove image"));
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

  const clearProductSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const resetProductState = useCallback(() => {
    dispatch(resetProduct());
    // Clear cache when resetting
    relatedCacheRef.current.clear();
  }, [dispatch]);

  const clearProductError = useCallback(() => {}, []);

  return {
    products,
    product,
    loading,
    error,
    success,
    fetchPublicProducts,
    fetchPublicProductById,
    fetchPublicProductBySlug,
    fetchProducts,
    fetchProductById,
    fetchRelatedProducts,
    clearRelatedCache,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    addMoreImages,
    removeImage,
    clearProductSuccess,
    resetProductState,
    clearProductError,
  };
};