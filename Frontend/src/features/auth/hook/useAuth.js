import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // ← ADD THIS
import { setErr, setLoading, setUser } from "../state/auth.slice";
import { registerUser, loginUser, getMe, logoutUser } from "../service/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  async function handleRegister({ email, fullname, contact, password, isSeller = false }) {
    try {
      dispatch(setLoading(true));
      const data = await registerUser({ email, fullname, contact, password, isSeller });
      dispatch(setUser(data.user));
      dispatch(setLoading(false));
      return data; 
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setErr(error.response?.data?.message || "Registration failed"));
      throw error;
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await loginUser({ email, password });
      dispatch(setUser(data.user));
      dispatch(setLoading(false));
      return data; 
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setErr(error.response?.data?.message || "Login failed"));
      throw error;
    }
  }

  async function checkAuth() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      dispatch(setLoading(false));
      return data.user;
    } catch (error) {
      dispatch(setUser(null));
      dispatch(setLoading(false));
      return null;
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logoutUser();
      dispatch(setUser(null));
      dispatch(setLoading(false));
      navigate("/login");
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setErr(error.response?.data?.message || "Logout failed"));
    }
  }

  return {
    handleRegister,
    handleLogin,
    checkAuth,
    handleLogout,
  };
};