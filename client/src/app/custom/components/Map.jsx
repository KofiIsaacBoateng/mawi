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
} from "@rnmapbox/maps";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiaWtoYXkiLCJhIjoiY2x5aXRma3JsMGcweDJsczh5dmR2dTZtMSJ9.S-Vx4yga6pqInFQ0fLcLnw";
Mapbox.setAccessToken(ACCESS_TOKEN);

const { width, height } = Dimensions.get("window");
const Map = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(undefined);
  const [permissionStatus, setPermissionStatus] = useState(undefined);
  const [gotLocation, setGotLocation] = useState(false);

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
        <MarkerView
          anchor={{ x: 0.5, y: 0.5 }}
          id="marker"
          coordinate={[-1.58333, 6.68333]}
        >
          <CustomMarkerWithCallout />
        </MarkerView>

        <MarkerView
          anchor={{ x: 0.5, y: 0.5 }}
          id="destination-marker"
          coordinate={[-1.58393, 6.68893]}
        >
          <CustomMarkerWithCallout />
        </MarkerView>
      </MapView>
    </Animated.View>
  );
};

const CustomMarkerWithCallout = () => {
  const [showCallout, setShowCallout] = useState(false);
  const calloutOpacity = useRef(new RNAnimated.Value(0)).current;
  const calloutPosition = useRef(new RNAnimated.Value(10)).current;

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
                uri: `https://avatar.iran.liara.run/public/boy?username=chad${Math.floor(
                  Math.random() * 201 + 100
                )}`,
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
    justifyContent: "flex-end",
    position: "relative",
    height: 150,
    width: 150,
  },

  markerImage: {
    position: "fixed",
    width: 50,
    height: 70,
    objectFit: "contain",
  },

  customCalloutWrapper: {
    alignItems: "center",
    position: "absolute",
    bottom: 70,
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
    objectFit: "contain",
    zIndex: 1,
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
