import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFormik } from "formik";
import { registrationValidationSchema } from "./utils/ValidationSchemas";
import Welcome from "../components/register/Welcome";
import CustomerForm from "../components/register/CustomerForm";
import ServiceForm from "../components/register/ServicerForm";

const Register = () => {
  const insets = useSafeAreaInsets();
  const [activeRole, setActiveRole] = useState(undefined);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/**** welcome => options */}
      <Welcome setActiveRole={setActiveRole} />
      {/**** registration procedure */}
      {activeRole === "customer" ? (
        <CustomerForm setActiveRole={setActiveRole} />
      ) : activeRole === "service-provider" ? (
        <ServiceForm setActiveRole={setActiveRole} />
      ) : (
        <></>
      )}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#066f66",
    flex: 1,
    alignItems: "center",
  },
});
