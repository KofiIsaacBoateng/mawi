import { StyleSheet, Text, View, TextInput, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

// icons
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
const CustomTextInputs = ({
  name,
  type,
  customStyle,
  reference,
  label,
  next,
  formik,
  returnKeyType,
  returnKeyLabel,
  keyboardType,
  multiline,
}) => {
  const { touched, errors, handleBlur, values, handleChange } = formik;
  const [touchedSelf, setTouchedSelf] = useState(false);
  const labelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          interpolate(touchedSelf, [true, false], [-35, 0]),
          { duration: 200 }
        ),
      },
    ],
  }));
  return (
    <View
      style={[styles.inputWrapper(touched[name], errors[name]), customStyle]}
    >
      <TextInput
        ref={reference}
        type={type}
        name={name}
        value={values[name]}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        onFocus={() => setTouchedSelf(true)}
        editable={name === "gender" ? false : true}
        onSubmitEditing={() => next?.current?.focus()}
        returnKeyLabel={returnKeyLabel}
        returnKeyType={returnKeyType}
        keyboardType={keyboardType ?? "default"}
        secureTextEntry={type === "password"}
        style={styles.input}
        multiline={multiline}
      />
      <Animated.View style={[styles.label, labelAnimatedStyle]}>
        <Text style={[styles.labelText(touched[name], errors[name])]}>
          {label}
        </Text>
      </Animated.View>
      {!touched[name] ? (
        <></>
      ) : errors[name] ? (
        <Ionicons
          style={styles.status}
          name="close-circle"
          color="firebrick"
          size={28}
        />
      ) : (
        <Ionicons
          style={styles.status}
          name="checkmark-circle"
          color="green"
          size={28}
        />
      )}
      {!touched[name] ? (
        <></>
      ) : errors[name] ? (
        <Text style={styles.errorText}>{errors[name]}</Text>
      ) : (
        <></>
      )}
    </View>
  );
};

export default CustomTextInputs;

const styles = StyleSheet.create({
  inputWrapper: (touched, error) => ({
    width: width * 0.8,
    marginTop: 30,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderWidth: 1,
    // borderWidth: 1,
    borderColor: !touched
      ? "#fff"
      : touched && error
      ? "firebrick"
      : "limegreen",
    borderRadius: 5,
    justifyContent: "center",
  }),

  input: {
    width: "100%",
    letterSpacing: 1,
    color: "#fff",
  },

  label: {
    position: "absolute",
    marginLeft: 15,
    backgroundColor: "#066f66",
    padding: 5,
  },
  status: {
    position: "absolute",
    right: 15,
  },

  errorText: {
    color: "firebrick",
    fontSize: 10,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -20,
    textAlign: "right",
  },

  labelText: (touched, error) => ({
    letterSpacing: 0.5,
    color: !touched ? "#fff" : touched && error ? "firebrick" : "limegreen",
  }),
});
