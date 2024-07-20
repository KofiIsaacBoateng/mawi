import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";

import AntDesign from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ServicesOverview = ({ setShowOverview }) => {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutRight}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.back, { marginTop: insets.top + 10 }]}
        onPress={() => setShowOverview(false)}
      >
        <AntDesign name="arrowleft" size={25} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.te}>Services Overview</Text>
    </Animated.View>
  );
};

export default ServicesOverview;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  back: {
    position: "absolute",
    top: 0,
    left: 15,
    width: 40,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: "#000a",
    alignItems: "center",
    justifyContent: "center",
  },

  te: {
    fontSize: 18,
    color: "#555c",
    fontWeight: "900",
  },
});
