import { useDispatch, useSelector } from "react-redux";
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
} from "../service/product.api";

export const useProduct = () => {
  const dispatch = useDispatch();
  const { products, product, loading, error, success } = useSelector(
    (state) => state.products
  );

  const fetchPublicProducts = async () => {
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
  };

  const fetchPublicProductById = async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await getPublicProductByIdAPI(id);
      dispatch(setProduct(data.product));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch product"));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const fetchProducts = async () => {
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
  };

  const fetchProductById = async (id) => {
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
  };

  const fetchRelatedProducts = async (id, limit = 8) => {
    try {
      const data = await getRelatedProductsAPI(id, limit);
      return data.products || [];
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      return [];
    }
  };

  const createNewProduct = async (formData) => {
    try {
      dispatch(setLoading(true));
      const data = await createProductAPI(formData);
      dispatch(addProduct(data.product));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to create product"));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const updateExistingProduct = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const data = await updateProductAPI(id, formData);
      dispatch(updateProduct(data.product));
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to update product"));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const deleteExistingProduct = async (id) => {
    try {
      dispatch(setLoading(true));
      await deleteProductAPI(id);
      dispatch(removeProduct(id));
      dispatch(setLoading(false));
      return { success: true };
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to delete product"));
      dispatch(setLoading(false));
      throw error;
    }
  };

  const addMoreImages = async (id, formData) => {
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
  };

  const removeImage = async (id, imageUrl) => {
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
  };

  const clearProductSuccess = () => {
    dispatch(clearSuccess());
  };

  const resetProductState = () => {
    dispatch(resetProduct());
  };

  const clearProductError = () => {};

  return {
    products,
    product,
    loading,
    error,
    success,
    fetchPublicProducts,
    fetchPublicProductById,
    fetchProducts,
    fetchProductById,
    fetchRelatedProducts,
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