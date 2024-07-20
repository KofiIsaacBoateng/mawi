import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useRef } from "react";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomTextInputs from "../CustomTextInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useFormik } from "formik";
import { registrationValidationSchemaForCustomer } from "../../screens/utils/ValidationSchemas";
import { useNavigation } from "@react-navigation/native";

const customInputStyle = {
  width: "85%",
  alignSelf: "center",
  marginTop: 25,
};

const { height, width } = Dimensions.get("window");
const CustomerForm = ({ setActiveRole }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      title: "",
      about: "",
    },
    // validationSchema: registrationValidationSchemaForCustomer,
    onSubmit: (values, helpers) => submit(values),
  });

  const submit = (values) => {
    navigation.navigate("Main");
  };

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutRight}
      style={[styles.container, { paddingTop: insets.top + 10 }]}
    >
      {/**** back icon */}
      <TouchableOpacity
        onPress={() => {
          formik.setFieldValue("role", "");
          setActiveRole("");
        }}
        activeOpacity={0.8}
        style={styles.back}
      >
        <AntDesign name="arrowleft" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.heading}>Let's set you up for your first Hire!</Text>

      {/***** banner */}
      <View style={styles.banner}>
        <LottieView
          style={styles.lottie}
          source={require("../../../../assets/lottie/lottie-login.json")}
          autoPlay
          loop
        />
      </View>

      <CustomTextInputs
        type="text"
        name="name"
        label="Full Name"
        reference={nameRef}
        next={emailRef}
        returnKeyLabel="Next"
        returnKeyType="next"
        formik={formik}
        customStyle={{ ...customInputStyle, marginTop: 5 }}
      />

      <CustomTextInputs
        type="email"
        name="email"
        label="Email"
        reference={emailRef}
        next={passwordRef}
        returnKeyLabel="Next"
        returnKeyType="next"
        formik={formik}
        customStyle={customInputStyle}
      />

      <CustomTextInputs
        type="password"
        name="password"
        label="Password"
        reference={passwordRef}
        returnKeyLabel="Continue"
        returnKeyType="next"
        formik={formik}
        customStyle={customInputStyle}
      />

      <View
        style={{
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <TouchableOpacity
          onPress={formik.handleSubmit}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default CustomerForm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#066f66",
    paddingBottom: 20,
  },

  back: {
    width: 40,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: "#0005",
    marginLeft: 10,
  },

  heading: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    alignSelf: "center",
  },

  banner: {
    height: height * 0.35,
    width,
  },

  lottie: {
    width: "100%",
    height: "100%",
  },

  button: {
    width: "90%",
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginTop: "auto",
    zIndex: 10,
    alignItems: "center",
    borderRadius: 10,
  },

  buttonText: {
    color: "#000c",
    fontSize: 18,
    fontWeight: "700",
  },
});
