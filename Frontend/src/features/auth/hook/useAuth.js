import { useDispatch } from "react-redux";
import { setErr, setLoading, setUser } from "../state/auth.slice";
import { registerUser, loginUser, getMe, logoutUser } from "../service/auth.api";



export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ email, fullname, contact, password, isSeller = false }) {
    try {
      const data = await registerUser({ email, fullname, contact, password, isSeller });

      console.log(data);

      dispatch(setUser(data.user));
    } catch (error) {
      console.log(error.response?.data);
    }
  }


  async function handleLogin({ email, password }) {
    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log(data);

      dispatch(setUser(data.user));
    } catch (error) {
      console.log(error.response?.data);
    }
  }

  async function checkAuth() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(setUser(null));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logoutUser();
      dispatch(setUser(null));
      dispatch(setLoading(false));
      navigate("/login"); // ← Works now!
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