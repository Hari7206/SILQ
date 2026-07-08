import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

   
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },

    setProduct: (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.error = null;
    },

    addProduct: (state, action) => {
      state.products.push(action.payload);
      state.success = true;
      state.loading = false;
    },

    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.product = action.payload;
      state.success = true;
      state.loading = false;
    },

    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (p) => p._id !== action.payload
      );
      state.success = true;
      state.loading = false;
    },

    clearSuccess: (state) => {
      state.success = false;
    },

    resetProduct: (state) => {
      state.product = null;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setProducts,
  setProduct,
  addProduct,
  updateProduct,
  removeProduct,
  clearSuccess,
  resetProduct,
} = productSlice.actions;

export default productSlice.reducer;