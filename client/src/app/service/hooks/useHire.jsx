import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import ToastAPI from "../../../utils/Toast";
import { useGlobalState } from "../../../context/GlobalState";
import {
  ACCEPT_HIRE_REQUEST,
  REJECT_HIRE_REQUEST,
} from "../../../utils/ENDPOINTS";

const useAcceptHireRequest = () => {
  const { setAuthStatus, token } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const acceptRequest = async (id) => {
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
      const res = await fetch(`${ACCEPT_HIRE_REQUEST}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        Toast.success(
          "You accepted a request!",
          "Congratulations, new job acquired."
        );
        return data;
      } else {
        Toast.error("Couldn't accept request!", "Please try again!");
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

  return [loading, acceptRequest];
};

const useRejectHireRequest = () => {
  const { setAuthStatus, token } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const rejectRequest = async (id) => {
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
      const res = await fetch(`${REJECT_HIRE_REQUEST}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        Toast.success(
          "You accepted a request!",
          "Congratulations, new job acquired."
        );
        return data;
      } else {
        Toast.error("Couldn't accept request!", "Please try again!");
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

  return [loading, rejectRequest];
};

export { useAcceptHireRequest, useRejectHireRequest };
