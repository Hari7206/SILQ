import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
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
    setCart: (state, action) => {
      state.items = action.payload.cart || [];
      state.totalItems = action.payload.totalItems || 0;
      state.totalAmount = action.payload.totalAmount || 0;
      state.loading = false;
      state.error = null;
    },
    addCartItem: (state, action) => {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => 
          i.product._id === item.product._id &&
          i.variant?._id === item.variant?._id &&
          i.size === item.size
      );

      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += item.quantity;
        state.items[existingIndex].subtotal = 
          state.items[existingIndex].price.amount * state.items[existingIndex].quantity;
      } else {
        state.items.push(item);
      }

      state.totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.subtotal, 0);
      state.loading = false;
    },
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.price.amount * quantity;
        
        state.totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
        state.totalAmount = state.items.reduce((sum, i) => sum + i.subtotal, 0);
      }
      state.loading = false;
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      
      state.totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.subtotal, 0);
      state.loading = false;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;