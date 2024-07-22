import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Animated as RNAnimated,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import * as Location from "expo-location";
import AntDesign from "react-native-vector-icons/AntDesign";
import Mapbox, {
  MapView,
  Camera,
  UserLocation,
  UserTrackingMode,
  MarkerView,
  ShapeSource,
  LineLayer,
} from "@rnmapbox/maps";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiaWtoYXkiLCJhIjoiY2x5aXRma3JsMGcweDJsczh5dmR2dTZtMSJ9.S-Vx4yga6pqInFQ0fLcLnw";
Mapbox.setAccessToken(ACCESS_TOKEN);

const { width, height } = Dimensions.get("window");

const Map = ({ setShowMap, showMap: { details } }) => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(undefined);
  const [permissionStatus, setPermissionStatus] = useState(undefined);
  const [gotLocation, setGotLocation] = useState(false);
  const [route, setRoute] = useState(undefined);

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
    console.log("location: ", location.coords);
    setLocation(location);
  }, []);

  const getDestinationRoute = useCallback(async () => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${
        location?.coords?.longitude
      },${location?.coords?.latitude};${details.jobLocation[0]},${[
        details.jobLocation[1],
      ]}?geometries=geojson&access_token=${ACCESS_TOKEN}`
    );
    const json = await query.json();
    const routes = json.routes[0].geometry;
    setRoute(routes);
  }, [location]);

  useEffect(() => {
    let locationUpdateInterval = undefined,
      routeUpdateInterval = undefined;
    if (permissionStatus === "granted") {
      // get user location every 5000ms
      locationUpdateInterval = setInterval(() => {
        getUserLocation();
        setGotLocation(true);
      }, 5000);

      routeUpdateInterval = setInterval(() => {
        getDestinationRoute();
      }, 2000);
    }

    return () => {
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
      }

      if (routeUpdateInterval) {
        clearInterval(routeUpdateInterval);
      }
    };
  }, [permissionStatus]);

  useEffect(() => {
    if (gotLocation) {
      getDestinationRoute();
    }
  }, [gotLocation]);

  useEffect(() => {
    (async () => {
      const res = await requestLocationPermission();
      if (res) {
        getUserLocation();
      }
    })();
  }, []);

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutRight}
      style={styles.container}
    >
      {!location && !permissionStatus ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <>
          {/**** go back */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowMap({ visible: false, details: undefined })}
            style={styles.topIcon(10)}
          >
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>

          <StatusBar hidden />
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
              followZoomLevel={20}
              followUserMode={UserTrackingMode.FollowWithHeading}
              animationMode="flyTo"
            />

            <UserLocation
              animated={true}
              visible={true}
              showsUserHeadingIndicator={true}
              androidRenderMode="compass"
              minDisplacement={2}
            />

            <MarkerView
              id="destination-marker"
              coordinate={[details.jobLocation[0], details.jobLocation[1]]}
            >
              <CustomMarkerWithCallout photo={details.customer.photo} />
            </MarkerView>

            {route && (
              <ShapeSource id="routeSource" shape={route}>
                <LineLayer id="routeLayer" style={styles.route} />
              </ShapeSource>
            )}
          </MapView>
        </>
      )}
    </Animated.View>
  );
};

const CustomMarkerWithCallout = ({ photo }) => {
  const [showCallout, setShowCallout] = useState(true);
  const calloutOpacity = useRef(new RNAnimated.Value(0)).current;
  const calloutPosition = useRef(new RNAnimated.Value(10)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      toggleCallout();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const toggleCallout = () => {
    if (showCallout) {
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
    width: 100,
  },

  markerImage: {
    width: 50,
    height: 70,
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
