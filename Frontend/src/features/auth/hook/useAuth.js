import { useDispatch } from "react-redux";
import { setErr, setLoading, setUser } from "../state/auth.slice";
import { registerUser } from "../service/auth.api";



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

  return {
    handleRegister,
    handleLogin,
  };
};