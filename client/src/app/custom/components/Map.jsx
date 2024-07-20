import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import * as Location from "expo-location";

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Mapbox, {
  MapView,
  Camera,
  UserLocation,
  UserTrackingMode,
  PointAnnotation,
  Callout,
  MarkerView,
  CircleLayer,
  ShapeSource,
} from "@rnmapbox/maps";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiaWtoYXkiLCJhIjoiY2x5aXRma3JsMGcweDJsczh5dmR2dTZtMSJ9.S-Vx4yga6pqInFQ0fLcLnw";
Mapbox.setAccessToken(ACCESS_TOKEN);

const { width, height } = Dimensions.get("window");
const Map = () => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const [location, setLocation] = useState(undefined);
  const [permissionStatus, setPermissionStatus] = useState(undefined);
  const [gotLocation, setGotLocation] = useState(false);
  const [searchText, setSearchText] = useState("");

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermissionStatus("denied");
      return false;
    }
    setPermissionStatus("granted");
    return true;
  };

  const getUserLocation = useCallback(async () => {
    let location = await Location.getCurrentPositionAsync({});
    console.log("my location: ", location.coords.latitude);
    setLocation(location);
  }, []);

  const flyToUsersLocation = () => {
    if (!mapRef.current) return;

    mapRef.current.setCamera({
      centerCoordinate: [location.coords.longitude, location.coords.latitude],
      zoomLevel: 14,
      animationDuration: 1000,
      animationMode: "flyTo",
    });
  };

  const search = () => {
    console.log("searching...");
  };

  useEffect(() => {
    let locationUpdateInterval = undefined;
    if (permissionStatus === "granted") {
      // get user location every 5000ms
      getUserLocation();
      setGotLocation(true);
    }

    return () => {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }
    };
  }, [permissionStatus]);

  useEffect(() => {
    (async () => {
      const res = await requestLocationPermission();
      if (res) {
        getUserLocation();
      }
    })();
  }, []);

  if (!location && !permissionStatus) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutRight}
      style={[styles.container]}
    >
      {/**** map */}
      <MapView
        style={styles.map}
        zoomEnabled={true}
        styleURL="mapbox://styles/mapbox/navigation-day-v1"
        rotateEnabled={true}
        pitchEnabled={true}
        attributionEnabled={false}
        scaleBarEnabled={false}
        logoEnabled={false}
      >
        <Camera
          ref={mapRef}
          zoomLevel={16}
          followUserLocation
          followPitch={60}
          followZoomLevel={16}
          followUserMode={UserTrackingMode.FollowWithHeading}
          animationMode="flyTo"
        />

        <UserLocation
          animated={true}
          visible={true}
          showsUserHeadingIndicator={true}
          androidRenderMode="compass"
        />

        {/**** destination custom marker */}
        <MarkerView id="marker" coordinate={[-1.58333, 6.68333]}>
          <View style={styles.customCalloutWrapper}>
            <CustomCallout />
          </View>

          <View style={[styles.marker]}>
            <Image
              source={require("../../../../assets/photos/destination-marker.png")}
              style={styles.markerImage}
            />
          </View>
        </MarkerView>

        <MarkerView id="destination-marker" coordinate={[-1.58393, 6.68893]}>
          <View style={styles.marker}>
            <Animated.Image
              source={require("../../../../assets/photos/destination-marker.png")}
              style={styles.markerImage}
            />
          </View>
        </MarkerView>
      </MapView>
    </Animated.View>
  );
};

const CustomCallout = () => {
  return (
    <View style={styles.customCallout}>
      <Image
        style={styles.customCalloutImage}
        source={{
          uri: "https://avatar.iran.liara.run/public/boy",
        }}
      />
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  loader: {
    width,
    height,
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },

  askLocation: {
    width: 40,
    aspectRatio: 1,
    backgroundColor: "#000a",
    borderRadius: 50,
    position: "absolute",
    bottom: 20,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
    backgroundColor: "#fff",
  },

  topIcon: (top) => ({
    width: 40,
    aspectRatio: 1,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000a",
    position: "absolute",
    top: top + 30,
    left: 10,
    zIndex: 10,
  }),

  map: {
    flex: 1,
    width: width,
  },
  route: {
    lineWidth: 6,
    lineJoin: "round",
    lineColor: "deepskyblue",
    lineDasharray: [1, 2],
    lineCap: "round",
  },

  marker: {
    alignItems: "center",
  },

  markerImage: {
    width: 50,
    height: 70,
    objectFit: "contain",
  },

  customCalloutWrapper: {
    alignItems: "center",
  },

  customCallout: {
    width: 70,
    height: 70,
    backgroundColor: "#43e8d878",
    borderRadius: 100,
    padding: 5,
    alignItems: "center",
    shadowColor: "#0005",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },

  customCalloutImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});

// <ShapeSource
//   id="circleSource"
//   shape={{
//     type: "Feature",
//     geometry: {
//       type: "Point",
//       coordinates: [-1.58333, 6.68333],
//     },
//   }}
// >
//   <CircleLayer
//     id="outerCircleLayer"
//     style={{
//       circleRadius: 40,
//       circleColor: "rgba(0, 150, 255, 0.15)",
//       circlePitchAlignment: "map",
//     }}
//   />
//   <CircleLayer
//     id="innerCircleLayer"
//     style={{
//       circleRadius: 65,
//       circleColor: "rgba(0, 150, 255, 0.25)",
//     }}
//   />
// </ShapeSource>;
