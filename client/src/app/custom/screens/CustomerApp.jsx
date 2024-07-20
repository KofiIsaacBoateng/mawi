import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Map from "../components/Map";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import ServicesOverview from "../components/ServicesOverview";

const services = [
  {
    id: 0,
    title: "Electrician",
    image: require("../../../../assets/photos/mawi.png"),
  },
  {
    id: 1,
    title: "Carpenter",
    image: require("../../../../assets/photos/mawi.png"),
  },
  {
    id: 2,
    title: "Mason",
    image: require("../../../../assets/photos/mawi.png"),
  },
  {
    id: 3,
    title: "Painter",
    image: require("../../../../assets/photos/mawi.png"),
  },
];

const { width, height } = Dimensions.get("window");
const CustomerApp = () => {
  const insets = useSafeAreaInsets();
  // const [searchTerm, setSearchTerm] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [filters, setFilters] = useState({});
  const [servicePersons, setServicePersons] = useState([]);
  const [activePersonnel, setActivePersonnel] = useState(undefined);

  const search = async () => {};

  return (
    <View style={[styles.container]}>
      <StatusBar hidden backgroundColor="transparent" barStyle="dark-content" />
      {/***** */}
      {/* <View style={styles.searchBarWrapper}> */}
      {/* <View style={[styles.searchBar, { marginTop: insets.top + 10 }]}> */}
      {/* <TextInput
            id="search"
            keyboardType="web-search"
            returnKeyLabel="Search"
            returnKeyType="search"
            value={searchTerm}
            placeholder="Search here"
            onChangeText={setSearchTerm}
            onSubmitEditing={search}
            style={styles.searchInput}
          /> */}
      <View style={styles.headerIcons}>
        <TouchableOpacity
          onPress={() => setShowOverview(true)}
          activeOpacity={0.8}
          style={styles.pendingServices}
        >
          <MaterialIcons name="pending-actions" size={28} color="#fff" />
          <Text style={styles.pendingServicesText}>services overview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
          style={[styles.filter, { marginTop: insets.top + 10 }]}
        >
          <MaterialCommunityIcons name="map-search" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* </View> */}
      {/* </View> */}

      {/***** map in hind site */}
      <Map />

      {/***** bottom sheet */}
      {showModal && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={styles.modal}
        >
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            activeOpacity={0.8}
            style={styles.closeModal}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.dragger} />

          {/***** content */}
          {/**** services list */}
          <ServiceCategories setFilters={setFilters} />
          {/***** visible service persons */}
          {/* <ServicePersons setActivePersonnel={setActivePersonnel} /> */}
        </Animated.View>
      )}

      {showOverview && <ServicesOverview setShowOverview={setShowOverview} />}
    </View>
  );
};

const ServiceCategories = ({ setFilters }) => {
  return (
    <View style={styles.services}>
      {/**** title */}
      <Text style={styles.servicesHeading}>Select a service</Text>
      {/*****ScrollView of categories */}
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        style={styles.serviceList}
        contentContainerStyle={styles.serviceListContainer}
        showsHorizontalScrollIndicator={false}
      >
        {services.map((service) => (
          <TouchableOpacity
            onPress={() =>
              setFilters((prev) => ({ ...prev, service: service.title }))
            }
            activeOpacity={0.85}
            key={service.id}
            style={styles.service}
          >
            <Image source={service.image} style={styles.serviceImage} />
            <Text style={styles.serviceTitle}>{service.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const ServicePersons = ({ setActivePersonnel }) => {
  return (
    <View style={styles.services}>
      {/**** title */}
      <Text style={styles.servicesHeading}>Who would you like to hire</Text>
      {/*****ScrollView of categories */}
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        style={styles.serviceList}
        contentContainerStyle={[styles.serviceListContainer, { gap: 15 }]}
        showsHorizontalScrollIndicator={false}
      >
        {services.map((service) => (
          <View key={service.id} style={styles.profile}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={{
                  uri: `https://avatar.iran.liara.run/public/boy?username=chad${Math.floor(
                    Math.random() * 201 + 100
                  )}`,
                }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileDetails}>
              {/***** name */}
              <Text style={styles.profileName}>Personnel Name</Text>
              {/***** age */}
              <Text style={styles.age}>Age: 36</Text>
              {/***** hire button */}
              <TouchableOpacity
                style={styles.hireBtn}
                onPress={() => setActivePersonnel(service)}
                activeOpacity={0.8}
              >
                <Text style={styles.hireText}>Hire me</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CustomerApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  searchBarWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    zIndex: 50,
    backgroundColor: "transparent",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    paddingRight: 15,
    marginHorizontal: "auto",
    zIndex: 20,
    overflow: "hidden",
    shadowColor: "#0001",
    shadowOffset: {
      height: 5,
      width: 0,
    },
    elevation: 5,
    shadowRadius: 10,
    shadowOpacity: 0.3,
  },

  searchInput: {
    paddingVertical: 13,
    paddingLeft: 15,
    flex: 1,
    color: "#000a",
  },

  headerIcons: {
    position: "absolute",
    top: 10,
    right: 15,
    left: 15,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pendingServices: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#000a",
  },

  pendingServicesText: {
    color: "#fffc",
  },

  filter: {
    backgroundColor: "#000a",
    width: 50,
    aspectRatio: 1,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    zIndex: 15,
    backgroundColor: "#000c",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  closeModal: {
    position: "absolute",
    top: 5,
    right: 10,
  },

  dragger: {
    width: 55,
    height: 7,
    marginHorizontal: "auto",
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 50,
  },

  /***** service list */
  services: {
    flex: 1,
  },

  servicesHeading: {
    fontSize: 17,
    fontWeight: "700",
    paddingLeft: 15,
    marginTop: 20,
    color: "#fffc",
  },

  serviceList: {
    width,
    flex: 1,
  },

  serviceListContainer: {
    paddingLeft: 15,
    alignItems: "center",
    gap: 15,
  },

  service: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#fff",
    paddingVertical: 10,
    borderRadius: 5,
  },

  serviceImage: {
    height: "40%",
    aspectRatio: 1,
  },

  serviceTitle: {
    fontSize: 13,
    color: "#fffc",
    marginTop: 10,
  },

  /***** personnel card */
  profile: {
    minWidth: 150,
    gap: 5,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
  },

  profileImageWrapper: {
    height: 70,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: "turquoise",
    padding: 3,
  },

  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  profileDetails: {},
  profileName: {
    fontSize: 16,
    color: "#fffc",
  },

  age: {
    fontSize: 13,
    color: "#fffa",
  },

  hireBtn: {
    backgroundColor: "turquoise",
    alignItems: "center",
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 5,
  },

  hireText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
  },
});
