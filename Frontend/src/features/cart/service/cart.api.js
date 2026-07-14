import axios from "axios";

const cartApi = axios.create({
  baseURL: "http://localhost:3000/api/cart",
  withCredentials: true,
});

/**
 * Add item to cart
 * @param {Object} data - { productId, variantId, size, quantity }
 */
export const addToCart = async (data) => {
  const res = await cartApi.post("/", data);
  return res.data;
};

/**
 * Get all cart items
 */
export const getCart = async () => {
  const res = await cartApi.get("/");
  return res.data;
};

/**
 * Update cart item quantity
 * @param {string} id - Cart item ID
 * @param {number} quantity - New quantity
 */
export const updateCartItem = async (id, quantity) => {
  const res = await cartApi.put(`/${id}`, { quantity });
  return res.data;
};

/**
 * Remove item from cart
 * @param {string} id - Cart item ID
 */
export const removeCartItem = async (id) => {
  const res = await cartApi.delete(`/${id}`);
  return res.data;
};