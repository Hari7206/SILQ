import axios from "axios";

const productApi = axios.create({
  baseURL: "http://localhost:3000/api/products",
  withCredentials: true,
});

// Get all products (seller's own products)
export const getProducts = async () => {
  const res = await productApi.get("/");
  return res.data;
};

// Get single product
export const getProductById = async (id) => {
  const res = await productApi.get(`/${id}`);
  return res.data;
};

// Create product with images
export const createProduct = async (formData) => {
  const res = await productApi.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Update product
export const updateProduct = async (id, formData) => {
  const res = await productApi.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const res = await productApi.delete(`/${id}`);
  return res.data;
};

// Add more images to product
export const addProductImages = async (id, formData) => {
  const res = await productApi.put(`/${id}/add-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Remove an image from product
export const removeProductImage = async (id, imageUrl) => {
  const res = await productApi.delete(`/${id}/remove-image`, {
    data: { imageUrl },
  });
  return res.data;
};



export const getPublicProducts = async () => {
  const res = await productApi.get("/public");
  return res.data;
};

// Get single product by ID (public)
export const getPublicProductById = async (id) => {
  const res = await productApi.get(`/public/${id}`);
  return res.data;
};