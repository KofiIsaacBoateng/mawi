import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastAPI from "../../utils/Toast";
import { LOGIN } from "../../utils/ENDPOINTS";
import { useGlobalState } from "../../context/GlobalState";

const useLogin = () => {
  const { setUser, setAuthStatus, setToken } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const login = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch(LOGIN, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, data, msg, token } = await res.json();

      if (success) {
        setUser(data);
        setAuthStatus("authenticated");
        setToken(token);
        await AsyncStorage.setItem("user", JSON.stringify(data));
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("auth-status", "authenticated");
        Toast.success("Success!", msg);
        return true;
      } else {
        Toast.error("Registration Failed!", msg);
        return false;
      }
    } catch (error) {
      Toast.error(
        "ERROR!",
        error?.response?.message || "Something went wrong please try again"
      );
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, login];
};

export default useLogin;
