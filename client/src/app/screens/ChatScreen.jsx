import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConvoContext } from "../context/ConversationContext";
import { useGetConversations } from "../hooks/useConversations";
import { useGlobalState } from "../../context/GlobalState";
import MessageView from "./MessageView";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const [loading, getConvos] = useGetConversations();
  const { user } = useGlobalState();
  const insets = useSafeAreaInsets();
  const [convos, setConvos] = useState([]);
  const [status, setStatus] = useState(undefined);
  const [activeConvo, setActiveConvo] = useState(undefined);
  const [showMessageScreen, setShowMessageScreen] = useState(false);

  const loadConversations = useCallback(async () => {
    const data = await getConvos(user?.role);

    if (!data) {
      setStatus("failed");
      return;
    }

    if (data && data.length === 0) {
      setStatus("empty");
      return;
    }

    setConvos(data);
  }, [convos]);

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerText}>Chats</Text>
      </View>

      {/***** convo lists */}
      <ScrollView
        style={styles.convoLists}
        contentContainerStyle={styles.convoListsContainer}
      >
        {loading && convos.length === 0 ? (
          <Loader />
        ) : status === "empty" ? (
          <FailedEmpty
            title="No conversation channels yet"
            btnText="Check again"
            onPress={loadConversations}
          />
        ) : status === "failed" ? (
          <FailedEmpty
            title="Failed to get conversations!"
            btnText="Try again"
            onPress={loadConversations}
          />
        ) : (
          convos.map((convo) => (
            <ConvoElement
              key={convo._id}
              convo={convo}
              activeConvo={activeConvo}
              setActiveConvo={setActiveConvo}
              setShowMessageScreen={setShowMessageScreen}
            />
          ))
        )}
      </ScrollView>
      {showMessageScreen && (
        <MessageView
          setShowMessageScreen={setShowMessageScreen}
          activeConvo={activeConvo}
        />
      )}
    </View>
  );
};

const ConvoElement = ({
  convo,
  setActiveConvo,
  activeConvo,
  setShowMessageScreen,
}) => {
  const { user } = useGlobalState();
  const partner =
    user?.role === "service-provider" ? convo.customer : convo.servicer;
  return (
    <TouchableOpacity
      onPress={() => {
        setActiveConvo(convo);
        setShowMessageScreen(true);
      }}
      activeOpacity={0.8}
      style={[
        styles.convoEl,
        activeConvo?._id === convo._id && { backgroundColor: "#35b2a5" },
      ]}
    >
      {/**** image */}
      <View style={styles.imageWrapper}>
        {convo?._id ? (
          <Image source={{ uri: partner.photo }} style={styles.image} />
        ) : (
          <></>
        )}
      </View>
      {/***** details */}
      <View style={styles.details}>
        {/**** name */}
        <Text
          style={[
            styles.name,
            activeConvo?._id === convo._id && { color: "#fff" },
          ]}
        >
          {partner?.name}
        </Text>
        {/**** recent messages */}
        <Text
          style={[
            styles.recentMessage,
            activeConvo?._id === convo._id && { color: "#fffc" },
          ]}
        >
          {convo?.recent ? convo?.recent?.message : "No recent messages"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Loader = () => {
  return (
    <View style={[styles.loader]}>
      <ActivityIndicator size="large" color="#35b2a5" />
    </View>
  );
};

const FailedEmpty = ({ title, btnText, onPress }) => {
  return (
    <View style={[styles.loader]}>
      <Text style={styles.failedEmptyTitle}>{title}</Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.failedEmptyBtn}
      >
        <Text style={styles.failedEmptyBtnText}>{btnText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },

  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#0003",
  },

  headerText: {
    fontSize: 25,
    fontWeight: "800",
    color: "#35b2a5",
  },

  loader: {
    width,
    flex: 1,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  failedEmptyTitle: {
    fontSize: 15,
    color: "#555a",
    fontWeight: "800",
  },

  failedEmptyBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#35b2a5",
    marginTop: 10,
  },

  failedEmptyBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#35b2a5",
  },

  convoLists: {
    flex: 1,
  },

  convoListsContainer: {
    paddingBottom: 70,
    paddingHorizontal: 15,
    paddingTop: 20,
    gap: 15,
  },

  convoEl: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  imageWrapper: {
    width: 60,
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
    fontSize: 15,
    fontWeight: "800",
    color: "#35b2a5",
  },

  recentMessage: {
    fontSize: 13,
    color: "#888a",
    fontWeight: "700",
  },
});
