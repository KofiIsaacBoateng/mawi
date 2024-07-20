import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNav from "./AuthNav";
import MainNav from "./MainNav";

const ApplicationStack = createStackNavigator();
const AppNavigation = () => {
  return (
    <ApplicationStack.Navigator
      initialRouteName="Authentication"
      screenOptions={{
        header: () => null,
      }}
    >
      <ApplicationStack.Screen component={AuthNav} name="Authentication" />
      <ApplicationStack.Screen component={MainNav} name="Main" />
    </ApplicationStack.Navigator>
  );
};

export default AppNavigation;
