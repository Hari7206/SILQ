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
    
      const cartItem = data.cartItem;
    
      const itemForRedux = {
        _id: cartItem._id,
        product: {
          _id: cartItem.product._id,
          title: cartItem.product.title,
          category: cartItem.product.category,
          mainImage: cartItem.product.mainImage || cartItem.product.images?.[0],
        },
        variant: cartItem.variant ? {
          _id: cartItem.variant._id,
          color: cartItem.variant.color,
          colorCode: cartItem.variant.colorCode,
        } : null,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: cartItem.price,
        subtotal: cartItem.price.amount * cartItem.quantity,
        inStock: true,
      };
      
      dispatch(addCartItem(itemForRedux));
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
  };
};