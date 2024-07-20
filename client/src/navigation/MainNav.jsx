import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import ServiceApp from "../app/service/screens/ServiceApp";
import CustomerApp from "../app/custom/screens/CustomerApp";

const MainNav = () => {
  const role = "customer";
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      {role === "service-provider" ? (
        <ServiceApp />
      ) : role === "customer" ? (
        <CustomerApp />
      ) : (
        <></>
      )}
    </View>
  );
};

export default MainNav;

const styles = StyleSheet.create({});
