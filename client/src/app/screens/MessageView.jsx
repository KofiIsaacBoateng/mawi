import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";

import AntDesign from "react-native-vector-icons/AntDesign";
import { useGlobalState } from "../../context/GlobalState";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MessageView = ({ activeConvo, setShowMessageScreen }) => {
  const insets = useSafeAreaInsets();
  const { user } = useGlobalState();
  const partner =
    user?.role === "service-provider"
      ? activeConvo.customer
      : activeConvo.servicer;

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutRight}
      style={styles.container}
    >
      {/**** header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => setShowMessageScreen(false)}
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
      <Text>MessageView</Text>
    </Animated.View>
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
    width: 50,
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
});
