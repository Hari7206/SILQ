import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setError,
  clearError,
  setCart,
  addCartItem,
  updateCartItem as updateCartItemAction,
  removeCartItem as removeCartItemAction,

  clearCart,
} from "../state/cart.slice";
import {
  addToCart as addToCartAPI,
  getCart as getCartAPI,
  updateCartItem as updateCartItemAPI,
  removeCartItem as removeCartItemAPI,
    createOrder as createOrderAPI,      
  verifyPayment as verifyPaymentAPI,  
} from "../service/cart.api";

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount, loading, error } = useSelector(
    (state) => state.cart
  );

  const fetchCart = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getCartAPI();
      dispatch(setCart(data));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch cart";
      dispatch(setError(errorMsg));
      throw error;
    }
  };

  const addToCart = async (itemData) => {
    try {
      dispatch(setLoading(true));
      const data = await addToCartAPI(itemData);
      
      const cartItem = {
        _id: data.cartItem._id,
        product: {
          _id: data.cartItem.product?._id || data.cartItem.product,
          title: data.cartItem.product?.title || "",
          category: data.cartItem.product?.category || "",
          mainImage: data.cartItem.product?.mainImage || null,
        },
        variant: data.cartItem.variant ? {
          _id: data.cartItem.variant._id,
          color: data.cartItem.variant.color,
          colorCode: data.cartItem.variant.colorCode,
        } : null,
        size: data.cartItem.size,
        quantity: data.cartItem.quantity,
        price: data.cartItem.price || { amount: 0, currency: "INR" },
        subtotal: data.cartItem.price?.amount * data.cartItem.quantity || 0,
        inStock: true,
      };
      
      dispatch(addCartItem(cartItem));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add to cart";
      dispatch(setError(errorMsg));
      throw error;
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      dispatch(setLoading(true));
      const data = await updateCartItemAPI(id, quantity);
      dispatch(updateCartItemAction({ id, quantity }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update quantity";
      dispatch(setError(errorMsg));
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await removeCartItemAPI(id);
      dispatch(removeCartItemAction(id));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to remove item";
      dispatch(setError(errorMsg));
      throw error;
    }
  };

  const clearCartItems = () => {
    dispatch(clearCart());
  };

  const clearCartError = () => {
    dispatch(clearError());
  };

    const createOrder = async (address) => {
    try {
      dispatch(setLoading(true));
      const data = await createOrderAPI({ address });
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create order";
      dispatch(setError(errorMsg));
      dispatch(setLoading(false));
      throw error;
    }
  };


  const verifyPayment = async (paymentData) => {
    try {
      dispatch(setLoading(true));
      const data = await verifyPaymentAPI(paymentData);
      
      // ✅ Clear cart on successful payment
      if (data.success) {
        dispatch(clearCart());
      }
      
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Payment verification failed";
      dispatch(setError(errorMsg));
      dispatch(setLoading(false));
      throw error;
    }
  };


  return {
    items,
    totalItems,
    totalAmount,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCartItems,
    clearCartError,


     createOrder,     
    verifyPayment,  
  };
};