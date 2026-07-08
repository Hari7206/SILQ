import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setProducts, setProduct, addProduct, updateProduct, removeProduct, clearSuccess, resetProduct } from "../state/product.slice";
import { getProducts as getProductsAPI, getProductById as getProductByIdAPI, createProduct as createProductAPI, updateProduct as updateProductAPI, deleteProduct as deleteProductAPI, addProductImages as addProductImagesAPI, removeProductImage as removeProductImageAPI } from "../service/product.api";




export const useProduct = () => {
  const dispatch = useDispatch();
  const { products, product, loading, error, success } = useSelector((state) => state.products);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getProductsAPI();
      dispatch(setProducts(data.products));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch products"));
      throw error;
    }
  };

  const fetchProductById = async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await getProductByIdAPI(id);
      dispatch(setProduct(data.product));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch product"));
      throw error;
    }
  };

  const createNewProduct = async (formData) => {
    try {
      dispatch(setLoading(true));
      const data = await createProductAPI(formData);
      dispatch(addProduct(data.product));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to create product"));
      throw error;
    }
  };

  const updateExistingProduct = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const data = await updateProductAPI(id, formData);
      dispatch(updateProduct(data.product));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to update product"));
      throw error;
    }
  };

  const deleteExistingProduct = async (id) => {
    try {
      dispatch(setLoading(true));
      await deleteProductAPI(id);
      dispatch(removeProduct(id));
      return { success: true };
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to delete product"));
      throw error;
    }
  };

  const addMoreImages = async (id, formData) => {
    try {
      dispatch(setLoading(true));
      const data = await addProductImagesAPI(id, formData);
      dispatch(updateProduct(data.product));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to add images"));
      throw error;
    }
  };

  const removeImage = async (id, imageUrl) => {
    try {
      dispatch(setLoading(true));
      const data = await removeProductImageAPI(id, imageUrl);
      dispatch(updateProduct(data.product));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to remove image"));
      throw error;
    }
  };

  const clearProductSuccess = () => {
    dispatch(clearSuccess());
  };

  const resetProductState = () => {
    dispatch(resetProduct());
  };

  const clearProductError = () => {
  
  };

  return { products, product, loading, error, success, fetchProducts, fetchProductById, createNewProduct, updateExistingProduct, deleteExistingProduct, addMoreImages, removeImage, clearProductSuccess, resetProductState, clearProductError };
};