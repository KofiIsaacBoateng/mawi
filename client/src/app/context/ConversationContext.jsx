import AsyncStorage from "@react-native-async-storage/async-storage";
import react, { useState, useEffect, createContext, useContext } from "react";
import { useGetConversations } from "../hooks/useConversations";
import { useGlobalState } from "../../context/GlobalState";

const Context = createContext();

const ConvoContext = ({ children }) => {
  const { user } = useGlobalState();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, getConvos] = useGetConversations();

  /**** clear storage */
  const clearStorage = async () => {};

  // clearStorage();

  const setupContext = async () => {
    // // conversations
    // const convos = await AsyncStorage.getItem("conversations");
    // if (convos) {
    //   setConversations(JSON.parse(convos));
    // }

    // // get updated convos from database
    // if (user?.role) {
    //   const dbConvos = await getConvos(user.role);
    //   if (dbConvos) {
    //     setConversations(dbConvos);
    //     await AsyncStorage.setItem("conversations", JSON.stringify(dbConvos));
    //   }
    // }

    // messages
    const messages = await AsyncStorage.getItem("messages");
    if (messages) {
      setMessages(JSON.parse(messages));
    }
  };

  useEffect(() => {
    setupContext();
  }, []);

  return (
    <Context.Provider
      value={{ conversations, setConversations, messages, setMessages }}
    >
      {children}
    </Context.Provider>
  );
};

export const useConvoContext = () => useContext(Context);
export default ConvoContext;
