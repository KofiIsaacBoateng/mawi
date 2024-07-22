import AsyncStorage from "@react-native-async-storage/async-storage";
import react, { useState, useEffect, createContext, useContext } from "react";
import { useGetConversations } from "../hooks/useConversations";
import { useGlobalState } from "../../context/GlobalState";
import { SOCKET_ENDPOINT } from "../../utils/ENDPOINTS";
import io from "socket.io-client";

const Context = createContext();

const ConvoContext = ({ children }) => {
  const { user } = useGlobalState();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, getConvos] = useGetConversations();
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [socketIo, setSocketIo] = useState(undefined);

  useEffect(() => {
    if (user) {
      console.log("user found. connecting to socket...");
      const socket = io(`${SOCKET_ENDPOINT}?userId=${user._id}`);
      setSocketIo(socket);
      socket.on("connect", () => {
        console.log("connected to socket with id: ", socket.id);

        // listen for new messages
        socket.on("incoming", (msg, ack) => {
          setMessages((prev) => [...prev, msg]);
          console.log("message received successfully");
        });
      });
    } else {
      console.log("failed to connect to socket... user id doesn't exist");
    }
  }, [user]);

  return (
    <Context.Provider
      value={{
        conversations,
        setConversations,
        messages,
        setMessages,
        showBottomTab,
        setShowBottomTab,
        socketIo,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useConvoContext = () => useContext(Context);
export default ConvoContext;
