import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import ServiceApp from "../app/service/screens/ServiceApp";
import CustomerApp from "../app/custom/screens/CustomerApp";
import { useGlobalState } from "../context/GlobalState";
import ConvoContext from "../app/context/ConversationContext";

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
          <ServiceApp />
        ) : user?.role === "customer" ? (
          <CustomerApp />
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
});
