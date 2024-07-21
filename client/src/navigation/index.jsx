import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import React from "react";
import AuthNav from "./AuthNav";
import MainNav from "./MainNav";
import { useGlobalState } from "../context/GlobalState";

const AppNavigation = () => {
  const { authStatus } = useGlobalState();

  return !authStatus ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  ) : authStatus === "no-auth" ? (
    <AuthNav />
  ) : authStatus === "authenticated" ? (
    <MainNav />
  ) : (
    <Text>What is this</Text>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppNavigation;

// <ApplicationStack.Navigator
//   initialRouteName="Authentication"
//   screenOptions={{
//     header: () => null,
//   }}
// >
//   <ApplicationStack.Screen component={AuthNav} name="Authentication" />
//   <ApplicationStack.Screen component={MainNav} name="Main" />
// </ApplicationStack.Navigator>
