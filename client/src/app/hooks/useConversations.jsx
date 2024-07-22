import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import ToastAPI from "../../utils/Toast";
import { useGlobalState } from "../../context/GlobalState";
import { GET_ALL_CONVERSATIONS, GET_CONVERSATION } from "../../utils/ENDPOINTS";

const useGetConversations = () => {
  const { setAuthStatus } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const getConvos = async (role) => {
    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      Toast.error(
        "Verification Error!",
        "Please login again or register if this is your first time."
      );
      setAuthStatus("no-auth");
      await SecureStore.setItemAsync("auth-status", "no-auth");
    }

    try {
      const res = await fetch(`${GET_ALL_CONVERSATIONS}/${role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        return data;
      } else {
        Toast.error("Request failed!", "Couldn't get conversations");
        console.log(msg);
        return false;
      }
    } catch (error) {
      Toast.error("ERROR!", "Something went wrong please try again");
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, getConvos];
};

const useGetConvo = () => {
  const { setAuthStatus, token } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const getConvo = async (id) => {
    setLoading(true);

    if (!token) {
      Toast.error(
        "Verification Error!",
        "Please login again or register if this is your first time."
      );
      setAuthStatus("no-auth");
      await SecureStore.setItemAsync("auth-status", "no-auth");
    }

    try {
      const res = await fetch(`${GET_CONVERSATION}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        Toast.success(msg, "Got conversation successfully!");
        return data;
      } else {
        Toast.error("Request failed!", "Couldn't this conversation");
        console.log(msg);
        return false;
      }
    } catch (error) {
      Toast.error("ERROR!", "Something went wrong please try again");
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, getConvo];
};

export { useGetConversations, useGetConvo };
