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
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Map from "../components/Map";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import ServicesOverview from "../components/ServicesOverview";
import RequestForm from "../components/RequestForm";
import useFeed from "../hooks/useFeed";

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
  const [location, setLocation] = useState(undefined);
  const [filters, setFilters] = useState({
    service: "none",
  });
  const [servicePersons, setServicePersons] = useState([]);
  const [activePersonnel, setActivePersonnel] = useState(undefined);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedHire, setSelectedHire] = useState(undefined);
  const [loading, fetchFeed] = useFeed();

  const getData = useCallback(async () => {
    const data = await fetchFeed(filters.service, [
      location.coords.longitude,
      location.coords.latitude,
    ]);
    if (!data) return;

    setServicePersons(data);
  }, [location]);

  useEffect(() => {
    getData();
  }, [location]);

  return (
    <View style={[styles.container]}>
      <StatusBar hidden backgroundColor="transparent" barStyle="dark-content" />
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
      <Map
        location={location}
        setLocation={setLocation}
        servicePersons={servicePersons}
        activePersonnel={activePersonnel}
      />

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
            <Ionicons name="close" size={28} color="#333c" />
          </TouchableOpacity>
          <View style={styles.dragger} />

          {/***** content */}
          {/**** services list */}
          {/* <ServiceCategories setFilters={setFilters} /> */}
          {/***** visible service persons */}
          <ServicePersons
            setShowRequestForm={setShowRequestForm}
            setSelectedHire={setSelectedHire}
            setActivePersonnel={setActivePersonnel}
            servicePersons={servicePersons}
          />
        </Animated.View>
      )}

      {showOverview && <ServicesOverview setShowOverview={setShowOverview} />}
      {showRequestForm && (
        <RequestForm
          selectedHire={selectedHire}
          setSelectedHire={setSelectedHire}
          setShowRequestForm={setShowRequestForm}
          jobLocation={[
            location?.coords?.longitude,
            location?.coords?.latitude,
          ]}
        />
      )}
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
            key={service._id}
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

const ServicePersons = ({
  setActivePersonnel,
  setSelectedHire,
  setShowRequestForm,
  servicePersons,
}) => {
  const hirePersonnel = (service) => {
    setShowRequestForm(true);
    setSelectedHire(service);
  };

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
        {servicePersons.length > 0 ? (
          servicePersons.map((service) => (
            <Pressable
              onPress={() => setActivePersonnel(service)}
              key={service.id}
              style={styles.profile}
            >
              <View style={styles.profileImageWrapper}>
                <Image
                  source={{
                    uri: service.photo,
                  }}
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.profileDetails}>
                {/***** name */}
                <Text style={styles.profileName}>{service.name}</Text>
                {/**** title */}
                <Text style={styles.profileTitle}>{service.title}</Text>
                {/***** hire button */}
                <TouchableOpacity
                  style={styles.hireBtn}
                  onPress={() => hirePersonnel(service)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.hireText}>Hire me</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          ))
        ) : (
          <View
            style={{
              flex: 1,
              width,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#000c" />
          </View>
        )}
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
    backgroundColor: "#fffe",
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
    backgroundColor: "#555",
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
    color: "#333c",
  },

  serviceList: {
    width,
    flex: 1,
  },

  serviceListContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
    gap: 15,
  },

  service: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#000c",
    paddingVertical: 10,
    borderRadius: 5,
  },

  serviceImage: {
    height: "40%",
    aspectRatio: 1,
  },

  serviceTitle: {
    fontSize: 13,
    color: "#333c",
    fontWeight: "700",
    marginTop: 10,
  },

  /***** personnel card */
  profile: {
    width: 150,
    height: height * 0.3,
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 0.5,
    borderColor: "#000c",
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

  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "800",
    textAlign: "center",
  },

  profileTitle: {
    marginVertical: 2,
    fontSize: 12,
    color: "#333d",
    textAlign: "center",
  },

  age: {
    fontSize: 13,
    color: "#555",
    fontWeight: "700",
  },

  hireBtn: {
    backgroundColor: "#35b2a5",
    alignItems: "center",
    paddingVertical: 5,
    marginTop: "auto",
    borderRadius: 5,
  },

  hireText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
  },
});
