import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import ToastAPI from "../../../utils/Toast";
import { useGlobalState } from "../../../context/GlobalState";
import { SERVICER_FEED } from "../../../utils/ENDPOINTS";

const useGetFeed = () => {
  const { setAuthStatus } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const getFeed = async (id) => {
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
      const res = await fetch(`${SERVICER_FEED}/${id}`, {
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
        Toast.error("Failed to get feed!", "Please try again!");
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

  return [loading, getFeed];
};

export default useGetFeed;
