import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import Animated, {
  interpolate,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTextInputs from "../CustomTextInput";
import LottieView from "lottie-react-native";
import { useFormik } from "formik";
import { registrationValidationSchema } from "../../screens/utils/ValidationSchemas";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const ServiceForm = ({ setActiveRole }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      title: "",
      about: "",
    },
    // validationSchema: registrationValidationSchema,
    onSubmit: (values, helpers) => submit(values),
  });

  const submit = (values) => {
    navigation.navigate("Main");
  };

  const formTransition = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(interpolate(currentPage, [0, 1], [0, -width])),
      },
    ],
  }));

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

      <Animated.View style={[styles.form, formTransition]}>
        <PersonalInfo
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          formik={formik}
        />
        <WorkInfo
          formik={formik}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </Animated.View>
    </Animated.View>
  );
};

const customInputStyle = {
  width: "85%",
  alignSelf: "center",
  marginTop: 25,
};

const PersonalInfo = ({ currentPage, setCurrentPage, formik }) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <View
      style={[
        styles.formPage,
        styles.personalInfo,
        currentPage !== 0 && { opacity: 0 },
      ]}
    >
      <Text style={styles.heading}>Let's get you set up for the future</Text>
      <View style={styles.banner}>
        <LottieView
          style={styles.lottie}
          source={require("../../../../assets/lottie/lottie-signup.json")}
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
        customStyle={customInputStyle}
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
          onPress={() => setCurrentPage(1)}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const WorkInfo = ({ setCurrentPage, currentPage, formik }) => {
  const titleRef = useRef(null);
  const aboutRef = useRef(null);

  return (
    <View
      style={[
        styles.formPage,
        styles.workInfo,
        currentPage !== 1 && { opacity: 0 },
      ]}
    >
      <Text style={styles.heading}>
        Just a brief detail about your field of work
      </Text>

      <View
        style={[styles.banner, { height: height * 0.4, alignItems: "center" }]}
      >
        <Image
          style={[styles.lottie, { height: "100%", aspectRatio: 1 }]}
          source={require("../../../../assets/photos/mawi.png")}
        />
      </View>

      <CustomTextInputs
        type="text"
        name="title"
        label="Job Title"
        reference={titleRef}
        next={aboutRef}
        returnKeyLabel="Next"
        returnKeyType="next"
        formik={formik}
        customStyle={customInputStyle}
      />

      <CustomTextInputs
        type="text"
        name="about"
        label="About you"
        reference={aboutRef}
        returnKeyLabel="Register"
        returnKeyType="send"
        formik={formik}
        customStyle={{ ...customInputStyle }}
      />

      <View style={styles.callToAction}>
        <TouchableOpacity
          onPress={() => setCurrentPage(0)}
          activeOpacity={0.8}
          style={[styles.button, styles.doubleButtonRow]}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={formik.handleSubmit}
          activeOpacity={0.8}
          style={[
            styles.button,
            styles.doubleButtonRow,
            { backgroundColor: "#0c0d34" },
          ]}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceForm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#066f66",
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
  },

  form: {
    flex: 1,
    width: width * 2,
    flexDirection: "row",
  },

  formPage: {
    position: "relative",
    width,
    height: "100%",
    alignItems: "center",
    paddingBottom: 15,
  },

  banner: {
    height: height * 0.3,
    width,
  },

  lottie: {
    width: "100%",
    height: "100%",
  },

  formInputs: {
    flex: 1,
    width: "90%",
  },

  callToAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "flex-end",
    width: "90%",
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

  doubleButtonRow: {
    flex: 1,
  },

  buttonText: {
    color: "#000c",
    fontSize: 18,
    fontWeight: "700",
  },
});
