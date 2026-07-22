import axios from "axios";

const productApi = axios.create({
  baseURL: "http://localhost:3000/api/products",
  withCredentials: true,
});

// ============ PUBLIC APIs ============

export const getPublicProducts = async () => {
  const res = await productApi.get("/public");
  return res.data;
};

export const getPublicProductById = async (id) => {
  const res = await productApi.get(`/public/id/${id}`);
  return res.data;
};

export const getPublicProductBySlug = async (slug) => {
  const res = await productApi.get(`/public/slug/${slug}`);
  return res.data;
};

export const getRelatedProducts = async (id, limit = 8) => {
  const res = await productApi.get(`/public/related/${id}?limit=${limit}`);
  return res.data;
};

// ============ PROTECTED APIs (Seller only) ============

export const getProducts = async () => {
  const res = await productApi.get("/");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await productApi.get(`/${id}`);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await productApi.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await productApi.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await productApi.delete(`/${id}`);
  return res.data;
};

export const addProductImages = async (id, formData) => {
  const res = await productApi.put(`/${id}/add-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const removeProductImage = async (id, imageUrl) => {
  const res = await productApi.delete(`/${id}/remove-image`, {
    data: { imageUrl },
  });
  return res.data;
};