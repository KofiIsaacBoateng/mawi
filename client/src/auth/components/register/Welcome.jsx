import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const { width, height } = Dimensions.get("window");
const Welcome = ({ setActiveRole }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Text style={styles.heading}>Welcome to Mawi</Text>
      <Text style={styles.description}>
        Please select a role that applies to you
      </Text>
      <View style={styles.options}>
        <OptionView
          onPress={() => setActiveRole("service-provider")}
          image={require("../../../../assets/photos/worker.png")}
          title="Provide a service"
        />
        <OptionView
          onPress={() => setActiveRole("customer")}
          image={require("../../../../assets/photos/customer.png")}
          title="Customer looking to hire"
        />
      </View>
    </ScrollView>
  );
};

const OptionView = ({ onPress, image, title }) => {
  return (
    <TouchableOpacity
      {...{ onPress }}
      activeOpacity={0.8}
      style={styles.option}
    >
      <Image source={image} style={styles.optionImage} />
      <Text style={styles.optionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
  },

  heading: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
  },

  description: {
    color: "#fffc",
    fontSize: 16,
  },

  options: {
    flex: 1,
    width: "100%",
    gap: 20,
    marginTop: 20,
  },

  option: {
    width: "100%",
    height: height * 0.35,
    backgroundColor: "#fff5",
    borderRadius: 15,
  },

  optionImage: {
    height: "85%",
    aspectRatio: 1,
    objectFit: "cover",
    alignSelf: "center",
  },

  optionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
