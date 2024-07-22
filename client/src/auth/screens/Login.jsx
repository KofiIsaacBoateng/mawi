import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { loginValidationSchema } from "./utils/ValidationSchemas";
import CustomTextInputs from "../components/CustomTextInput";
import useLogin from "../hooks/useLogin";

const { width, height } = Dimensions.get("window");
const Login = () => {
  const [loading, login] = useLogin();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const customInputStyle = {
    width: "85%",
    alignSelf: "center",
    marginTop: 25,
  };

  const submit = async (values) => {
    console.log("logging in...");
    const result = await login(values);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: submit,
  });

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
      }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/***** banner */}
      <View style={styles.banner}>
        <LottieView
          style={styles.lottie}
          source={require("../../../assets/lottie/lottie-login.json")}
          autoPlay
          loop
        />
      </View>
      {/***** title */}
      <Text style={styles.title}>Login to your account</Text>
      {/***** description */}
      <View style={styles.signupRole}>
        <Text style={styles.description}>Don't have an account ?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.8}
          style={styles.signup}
        >
          <Text style={styles.signup}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {/***** inputs */}
      <CustomTextInputs
        type="email"
        name="email"
        label="Enter email"
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
        label="Enter password"
        reference={passwordRef}
        returnKeyLabel="Login"
        returnKeyType="send"
        formik={formik}
        customStyle={customInputStyle}
      />

      {/***** call to action */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={formik.handleSubmit}
          activeOpacity={0.8}
          style={[styles.buttons]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000c" />
          ) : (
            <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
      {/***** sign up text */}
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width,
  },

  banner: {
    height: height * 0.45,
    width,
  },

  lottie: {
    width: "100%",
    height: "100%",
  },

  title: {
    fontSize: 25,
    color: "#333c",
    fontWeight: "bold",
    width: width * 0.85,
    marginTop: -20,
  },

  signupRole: {
    width: width * 0.85,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },

  description: {
    fontSize: 15,
    color: "#000c",
  },

  signup: {
    color: "#066f66",
    fontSize: 16,
    fontWeight: "800",
  },

  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },

  buttons: {
    width: "85%",
    alignSelf: "center",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#066f66",
    marginBottom: 20,
  },

  buttonText: {
    fontWeight: "800",
    fontSize: 16,
    color: "#fff",
  },
});
