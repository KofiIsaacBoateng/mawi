import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Animated as RNAnimated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Mapbox, {
  MapView,
  Camera,
  UserLocation,
  UserTrackingMode,
  MarkerView,
  ShapeSource,
  SymbolLayer,
} from "@rnmapbox/maps";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiaWtoYXkiLCJhIjoiY2x5aXRma3JsMGcweDJsczh5dmR2dTZtMSJ9.S-Vx4yga6pqInFQ0fLcLnw";
Mapbox.setAccessToken(ACCESS_TOKEN);

const { width, height } = Dimensions.get("window");
const Map = ({ location, setLocation, servicePersons, activePersonnel }) => {
  const mapRef = useRef(null);
  const [permissionStatus, setPermissionStatus] = useState(undefined);

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

  const fitToUserLocation = (userLocation) => {
    mapRef.current?.fitBounds(
      [location.coords.longitude, location.coords.latitude],
      userLocation,
      [50, 50, height * 0.5, 50],
      1000
    );
  };

  const flyToUserLocation = (userLocation) => {
    mapRef.current?.setCamera({
      centerCoordinate: userLocation,
      animationMode: "flyTo",
      animationDuration: 1000,
      zoomLevel: 20,
    });
  };

  useEffect(() => {
    if (activePersonnel?._id) {
      // fitToUserLocation(activePersonnel.location);
      flyToUserLocation(activePersonnel.location);
    }
  }, [activePersonnel]);

  useEffect(() => {
    let locationUpdateInterval = undefined;
    if (permissionStatus === "granted") {
      getUserLocation();
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
          zoomLevel={14}
          followUserLocation={!activePersonnel}
          followPitch={40}
          followZoomLevel={14}
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
        {servicePersons.length > 0 &&
          servicePersons.map((person) => (
            <MarkerView
              key={person._id}
              anchor={{ x: 0.5, y: 0.5 }}
              id="marker"
              coordinate={person.location}
            >
              <CustomMarkerWithCallout
                activePersonnel={activePersonnel}
                _id={person._id}
                photo={person.photo}
              />
            </MarkerView>
          ))}
      </MapView>
    </Animated.View>
  );
};

const CustomMarkerWithCallout = ({ photo, activePersonnel, _id }) => {
  const [showCallout, setShowCallout] = useState(false);
  const calloutOpacity = useRef(new RNAnimated.Value(0)).current;
  const calloutPosition = useRef(new RNAnimated.Value(10)).current;

  useEffect(() => {
    if (activePersonnel?._id === _id) {
      setShowCallout(false);
      toggleCallout();
    } else {
      setShowCallout(true);
      toggleCallout();
    }
  }, [activePersonnel]);

  const toggleCallout = () => {
    if (showCallout) {
      // Hide callout
      RNAnimated.timing(calloutOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      RNAnimated.timing(calloutPosition, {
        toValue: 10,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowCallout(false));
    } else {
      // Show callout
      setShowCallout(true);
      RNAnimated.timing(calloutOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      RNAnimated.timing(calloutPosition, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleCallout}
      activeOpacity={0.85}
      style={styles.marker}
    >
      {showCallout && (
        <RNAnimated.View
          style={[
            styles.customCalloutWrapper,
            {
              opacity: calloutOpacity,
              transform: [{ translateY: calloutPosition }],
            },
          ]}
        >
          <View style={styles.customCallout}>
            <Image
              style={styles.customCalloutImage}
              source={{
                uri: photo,
              }}
            />
            <View style={styles.tip} />
          </View>
        </RNAnimated.View>
      )}
      <Image
        source={require("../../../../assets/photos/destination-marker.png")}
        style={styles.markerImage}
      />
    </TouchableOpacity>
  );
};

export default Map;

const styles = StyleSheet.create({
  loader: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },

  container: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
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
    top: top,
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
    justifyContent: "center",
    height: 230,
    width: 72,
  },

  markerImage: {
    width: 50,
    height: 50,
  },

  customCalloutWrapper: {
    alignItems: "center",
    position: "absolute",
    position: "absolute",
    bottom: 160,
  },

  customCallout: {
    width: 70,
    height: 70,
    backgroundColor: "turquoise",
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
  },

  tip: {
    position: "absolute",
    bottom: -5,
    width: 20,
    height: 20,
    transform: [{ rotate: "45deg" }],
    backgroundColor: "turquoise",
    zIndex: -1,
  },
});
