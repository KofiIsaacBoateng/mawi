import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import ServiceApp from "../app/service/screens/ServiceApp";
import CustomerApp from "../app/custom/screens/CustomerApp";
import { useGlobalState } from "../context/GlobalState";
import ConvoContext, {
  useConvoContext,
} from "../app/context/ConversationContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "../app/screens/ChatScreen";

// icons
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

const CustomerBottomTab = createBottomTabNavigator();
const ServicerBottomTab = createBottomTabNavigator();

const CustomerAppNavigation = () => {
  const { showBottomTab } = useConvoContext(false);

  return (
    <CustomerBottomTab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          height: 55,
          position: "absolute",
          bottom: showBottomTab ? 0 : -60,
          zIndex: 3,
        },
      }}
    >
      <CustomerBottomTab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons
              name="home"
              size={22}
              color={focused ? "#35b2a5" : "#555"}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused && { color: "#35b2a5" }]}>
              Home
            </Text>
          ),
        }}
        name="Home"
        component={CustomerApp}
      />
      <CustomerBottomTab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="chatbubbles-outline"
              size={22}
              color={focused ? "#35b2a5" : "#555"}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused && { color: "#35b2a5" }]}>
              Chat
            </Text>
          ),
        }}
        name="Chat"
        component={ChatScreen}
      />
    </CustomerBottomTab.Navigator>
  );
};

const ServicerAppNavigation = () => {
  const { showBottomTab } = useConvoContext();

  return (
    <ServicerBottomTab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          height: 55,
          position: "absolute",
          transform: [{ translateY: showBottomTab ? 0 : 60 }],
          zIndex: 3,
        },
      }}
    >
      <ServicerBottomTab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons
              name="home"
              size={22}
              color={focused ? "#35b2a5" : "#555"}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused && { color: "#35b2a5" }]}>
              Home
            </Text>
          ),
        }}
        name="Home"
        component={ServiceApp}
      />
      <ServicerBottomTab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="chatbubbles-outline"
              size={22}
              color={focused ? "#35b2a5" : "#555"}
            />
          ),

          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused && { color: "#35b2a5" }]}>
              Chat
            </Text>
          ),
        }}
        name="Chat"
        component={ChatScreen}
      />
    </ServicerBottomTab.Navigator>
  );
};

const MainNav = () => {
  const { user } = useGlobalState();

  return (
    <ConvoContext>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        {!user?.role ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : user?.role === "service-provider" ? (
          <ServicerAppNavigation />
        ) : user?.role === "customer" ? (
          <CustomerAppNavigation />
        ) : (
          <></>
        )}
      </View>
    </ConvoContext>
  );
};

export default MainNav;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 13,
    color: "#555c",
  },
});
