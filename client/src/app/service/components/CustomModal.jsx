import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
const CustomModal = ({ setShowModal, children }) => {
  return (
    <Animated.View
      entering={SlideInDown}
      exiting={SlideOutDown}
      style={styles.modal}
    >
      <TouchableOpacity
        onPress={() => setShowModal(false)}
        style={styles.closeModal}
      >
        <Ionicons name="close" size={28} color="#888" />
      </TouchableOpacity>
      <View style={styles.dragger} />

      {children}
    </Animated.View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
    zIndex: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  closeModal: {
    position: "absolute",
    top: 10,
    right: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  dragger: {
    width: 55,
    height: 7,
    marginHorizontal: "auto",
    marginTop: 5,
    backgroundColor: "#aaa",
    borderRadius: 50,
  },
});
