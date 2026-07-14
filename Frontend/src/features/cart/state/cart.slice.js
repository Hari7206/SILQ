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
    
      const existingIndex = state.items.findIndex(
        (item) => 
          item.product._id === action.payload.product._id &&
          item.variant?._id === action.payload.variant?._id &&
          item.size === action.payload.size
      );

      if (existingIndex !== -1) {
      
        state.items[existingIndex].quantity += action.payload.quantity;
        state.items[existingIndex].subtotal = 
          state.items[existingIndex].price.amount * state.items[existingIndex].quantity;
      } else {
     
        state.items.push(action.payload);
      }

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      state.loading = false;
    },

    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.price.amount * quantity;
        
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      }
      state.loading = false;
    },

    removeCartItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
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

// Export reducer
export default cartSlice.reducer;