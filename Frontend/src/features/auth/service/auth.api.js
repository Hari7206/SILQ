import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/auth",
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