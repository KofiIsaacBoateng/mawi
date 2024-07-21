import AsyncStorage from "@react-native-async-storage/async-storage";
import react, { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";

const Context = createContext();

const GlobalState = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [authStatus, setAuthStatus] = useState(undefined);
  const [token, setToken] = useState(undefined);

  const getUser = async () => {
    const authStatusString = await SecureStore.getItemAsync("auth-status");
    if (authStatusString) {
      setAuthStatus(authStatusString);
    } else {
      setAuthStatus("no-auth");
    }

    const tokenString = await SecureStore.getItemAsync("token");
    if (tokenString) {
      setToken(tokenString);
    }

    const userString = await AsyncStorage.getItem("user");
    if (userString) {
      setUser((prev) => JSON.parse(userString));
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Context.Provider
      value={{ user, setUser, authStatus, setAuthStatus, token, setToken }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGlobalState = () => useContext(Context);
export default GlobalState;
