import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import ToastAPI from "../../../utils/Toast";
import { useGlobalState } from "../../../context/GlobalState";
import { SERVICE_FEED } from "../../../utils/ENDPOINTS";

const useFeed = () => {
  const { setAuthStatus, token } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const fetchFeed = async (service, lnglat) => {
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
      const res = await fetch(SERVICE_FEED(service, lnglat), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        Toast.success("Fetch feed successful!", msg);
        return data;
      } else {
        Toast.error("Fetch feed failed!", msg);
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

  return [loading, fetchFeed];
};

export default useFeed;
