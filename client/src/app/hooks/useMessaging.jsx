import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import ToastAPI from "../../utils/Toast";
import { useGlobalState } from "../../context/GlobalState";
import { SEND_MESSAGE } from "../../utils/ENDPOINTS";
import { useConvoContext } from "../context/ConversationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useSendMessage = () => {
  const { setAuthStatus } = useGlobalState();
  const { setMessages, socketIo } = useConvoContext();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const sendMessage = async (messageData) => {
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
      const res = await fetch(`${SEND_MESSAGE}`, {
        method: "POST",
        body: JSON.stringify(messageData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        socketIo?.emit("new-message", data);
        console.log("socket emitted successfully!");
        let newMessages;
        setMessages((prev) => {
          newMessages = [...prev, data];
          return newMessages;
        });

        // await AsyncStorage.setItem("messages", JSON.stringify(newMessages));

        return true;
      } else {
        Toast.error("Message send failed!", "Please try again!");
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
