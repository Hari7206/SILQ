import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/auth",
  withCredentials: true,
});

export const registerUser = async ({
  email,
  contact,
  fullname,
  password,
  isSeller,
}) => {
  const res = await authApi.post("/register", {
    email,
    password,
    fullname,
    contact,
    isSeller,
  });

  return res.data;
};

export const loginUser = async ({ email, password }) => {
  const res = await authApi.post("/login", {
    email,
    password,
  });

  return res.data;
};


export const getMe = async () => {
  const res = await authApi.get("/me");
  return res.data;
};

export const logoutUser = async () => {
  const res = await authApi.post("/logout");
  return res.data;
};



export const forgotPassword = async (email) => {
  const res = await authApi.post("/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await authApi.post(`/reset-password/${token}`, { password });
  return res.data;
};

export const verifyResetToken = async (token) => {
  const res = await authApi.get(`/verify-reset-token/${token}`);
  return res.data;
};