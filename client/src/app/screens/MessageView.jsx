import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  Keyboard,
  StatusBar,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";

import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useGlobalState } from "../../context/GlobalState";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConvoContext } from "../context/ConversationContext";
import useSendMessage from "../hooks/useMessaging";
import { useGetConvo } from "../hooks/useConversations";
import { Loader } from "./ChatScreen";

const { width, height } = Dimensions.get("window");
const MessageView = ({ activeConvo, setShowMessageScreen }) => {
  const scrollViewRef = useRef(null);
  const { setShowBottomTab, messages, setMessages } = useConvoContext();
  const insets = useSafeAreaInsets();
  const { user } = useGlobalState();
  const [message, setMessage] = useState("");
  const [loading, sendMessage] = useSendMessage();
  const [convoLoading, getConversation] = useGetConvo();
  const partner =
    user?.role === "service-provider"
      ? activeConvo.customer
      : activeConvo.servicer;

  const send = async () => {
    if (message.length === 0) return;

    const result = await sendMessage({
      message,
      receiver: partner._id,
      conversationId: activeConvo._id,
    });
    if (result) {
      console.log("message sent");
      setMessage("");
      Keyboard?.dismiss();
    }
  };

  const getConvo = async () => {
    const data = await getConversation(activeConvo._id);
    if (data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    scrollViewRef?.current.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    getConvo();
  }, []);

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutRight}
      style={styles.container}
    >
      {/**** header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => {
            setShowMessageScreen(false);
            setShowBottomTab(true);
          }}
          activeOpacity={0.8}
          style={styles.back}
        >
          <AntDesign name="arrowleft" size={28} color="#333a" />
        </TouchableOpacity>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: partner.photo }} style={styles.image} />
        </View>
        <Text style={styles.name}>{partner.name}</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContainer}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {messages &&
          messages.length > 0 &&
          messages?.map((message, index) => (
            <Message
              key={index}
              message={message}
              right={message.sender._id === user._id}
            />
          ))}
        {(convoLoading || loading) && <Loader />}
      </ScrollView>

      <View style={styles.footer}>
        <TextInput
          id="message-input"
          placeholder="Type message here"
          value={message}
          onChangeText={setMessage}
          returnKeyLabel="Send"
          returnKeyType="send"
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={send}
          style={styles.send}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const Message = ({ message, right }) => {
  return (
    <View
      style={[
        styles.message,
        {
          marginLeft: right ? "auto" : 0,
          backgroundColor: right ? "#35b2a5" : "#333c",
        },
      ]}
    >
      <Text style={styles.messageText}>{message.message}</Text>
      <Text style={styles.time}>12:45</Text>
    </View>
  );
};

export default MessageView;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#0003",
  },

  back: {
    marginRight: 15,
  },

  imageWrapper: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: "#0003",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  name: {
    fontSize: 17,
    fontWeight: "800",
    color: "#555",
    marginLeft: 15,
  },

  /**** messages  */
  messages: {
    backgroundColor: "#eee",
  },

  messagesContainer: {
    paddingHorizontal: 5,
    paddingBottom: 65,
  },

  message: {
    maxWidth: width * 0.6,
    minWidth: 120,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  messageText: {
    color: "#fff",
    fontSize: 14,
  },

  time: {
    marginLeft: "auto",
    color: "#eee",
    fontSize: 11,
    marginTop: 5,
  },

  /***** footer */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },

  textInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333c",
  },

  send: {
    backgroundColor: "#35b2a5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});
