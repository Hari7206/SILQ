import axios from "axios";

const cartApi = axios.create({
  baseURL: "http://localhost:3000/api/cart",
  withCredentials: true,
});

export const addToCart = async (data) => {
  const res = await cartApi.post("/", data);
  return res.data;
};

export const getCart = async () => {
  const res = await cartApi.get("/");
  return res.data;
};

export const updateCartItem = async (id, quantity) => {
  const res = await cartApi.put(`/${id}`, { quantity });
  return res.data;
};

export const removeCartItem = async (id) => {
  const res = await cartApi.delete(`/${id}`);
  return res.data;
};