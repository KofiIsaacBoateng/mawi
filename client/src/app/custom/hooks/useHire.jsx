import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import ToastAPI from "../../../utils/Toast";
import { useGlobalState } from "../../../context/GlobalState";
import { SEND_HIRE_REQUEST } from "../../../utils/ENDPOINTS";

const useSendHireRequest = () => {
  const { setAuthStatus, token } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const sendRequest = async (requestData) => {
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
      const res = await fetch(SEND_HIRE_REQUEST, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        Toast.success(
          "Request successfully!",
          "Your hire request has been sent successfully"
        );
        return data;
      } else {
        Toast.error("Hire request failed!", "Please try again!");
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

  return [loading, sendRequest];
};

export default useSendHireRequest;
