import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "../auth/screens/Register";
import Login from "../auth/screens/Login";
import Initial from "../auth/screens/Initial";

const AuthNavigator = createStackNavigator();

const AuthNav = () => {
  return (
    <AuthNavigator.Navigator
      initialRouteName="Initial"
      screenOptions={{
        header: () => null,
      }}
    >
      <AuthNavigator.Screen component={Initial} name="Initial" />
      <AuthNavigator.Screen component={Register} name="Register" />
      <AuthNavigator.Screen component={Login} name="Login" />
    </AuthNavigator.Navigator>
  );
};

export default AuthNav;

const styles = StyleSheet.create({});
