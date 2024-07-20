import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const Initial = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/**** title - mawi */}
      <Text style={styles.title}>Mawi</Text>
      {/***** banner */}
      <View style={styles.banner}>
        <LottieView
          style={styles.lottie}
          source={require("../../../assets/lottie/work-initial.json")}
          autoPlay
          loop
        />
      </View>
      <View style={styles.indicators}>
        <View style={[styles.indicator]} />
        <View style={[styles.indicator, styles.middle]} />
        <View style={[styles.indicator]} />
      </View>
      {/****** description title */}
      <Text style={styles.heading}>Where you get the job done</Text>
      {/***** description description */}
      <Text style={styles.description}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias
        animi architecto iusto.
      </Text>
      {/****** call to actions */}
      <View style={styles.callToAction}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.8}
          style={[styles.buttons, styles.signup]}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
          style={[styles.buttons, styles.login]}
        >
          <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Initial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#066f66",
  },

  title: {
    position: "absolute",
    top: 30,
    width,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "900",
    color: "#fffc",
    textTransform: "uppercase",
  },

  banner: {
    width: "100%",
    height: height * 0.5,
  },

  lottie: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  indicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: -15,
    marginBottom: 15,
  },

  indicator: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#fff8",
  },

  middle: {
    width: 25,
    backgroundColor: "#fffa",
  },

  heading: {
    color: "#fffc",
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
  },

  description: {
    color: "#fffa",
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
    width: "80%",
    alignSelf: "center",
  },

  callToAction: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },

  buttons: {
    alignSelf: "center",
    width: "80%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  login: {
    backgroundColor: "transparent",
  },

  signup: {
    marginTop: "auto",
  },

  buttonText: {
    fontWeight: "800",
    fontSize: 16,
  },

  loginText: {
    color: "#fffc",
  },
});