import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import ToastAPI from "../../utils/Toast";
import { useGlobalState } from "../../context/GlobalState";
import { SEND_MESSAGE } from "../../utils/ENDPOINTS";
import { useConvoContext } from "../context/ConversationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useSendMessage = () => {
  const { setAuthStatus, token } = useGlobalState();
  const { setMessages } = useConvoContext();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const sendMessage = async (messageData, convoId) => {
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
      const res = await fetch(`${SEND_MESSAGE}/${convoId}`, {
        method: "POST",
        body: JSON.stringify(messageData),
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
        let newMessages;
        setMessages((prev) => {
          newMessages = [...prev, data];
        });

        await AsyncStorage.setItem("messages", JSON.stringify(newMessages));

        return true;
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

  return [loading, sendMessage];
};

export default useSendMessage;
