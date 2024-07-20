import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Map from "../components/Map";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CustomerApp = () => {
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const search = async () => {};

  return (
    <View style={[styles.container]}>
      <StatusBar hidden backgroundColor="transparent" barStyle="dark-content" />
      {/***** */}
      <View style={styles.searchBarWrapper}>
        <View style={[styles.searchBar, { marginTop: insets.top + 10 }]}>
          <TextInput
            id="search"
            keyboardType="web-search"
            returnKeyLabel="Search"
            returnKeyType="search"
            value={searchTerm}
            placeholder="Search here"
            onChangeText={setSearchTerm}
            onSubmitEditing={search}
            style={styles.searchInput}
          />
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.8}
            style={styles.filter}
          >
            <Ionicons name="filter" size={24} color="#000a" />
          </TouchableOpacity>
        </View>
      </View>
      <Map />

      {/***** bottom sheet */}
      {showModal && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={styles.modal}
        >
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            activeOpacity={0.8}
            style={styles.closeModal}
          >
            <Ionicons name="close" size={28} color="#000c" />
          </TouchableOpacity>
          <View style={styles.dragger} />
        </Animated.View>
      )}
    </View>
  );
};

export default CustomerApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  searchBarWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    alignItems: "center",
    zIndex: 50,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    backgroundColor: "#ddd",
    borderRadius: 50,
    paddingRight: 15,
    marginHorizontal: "auto",
    zIndex: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      height: 5,
      width: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
  },

  searchInput: {
    paddingVertical: 13,
    paddingLeft: 15,
    flex: 1,
    color: "#000a",
  },

  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    zIndex: 15,
    backgroundColor: "#ddd",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  closeModal: {
    position: "absolute",
    top: 5,
    right: 10,
  },

  dragger: {
    width: 55,
    height: 7,
    marginHorizontal: "auto",
    marginTop: 5,
    backgroundColor: "darkgray",
    borderRadius: 50,
  },
});
