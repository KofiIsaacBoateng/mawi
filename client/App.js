import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Mapbox, {
  UserLocation,
  Camera,
  MapView,
  PointAnnotation,
  UserTrackingMode,
  UserLocationRenderMode,
} from "@rnmapbox/maps";
import { useRef } from "react";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiaWtoYXkiLCJhIjoiY2x5aXRma3JsMGcweDJsczh5dmR2dTZtMSJ9.S-Vx4yga6pqInFQ0fLcLnw";
Mapbox.setAccessToken(ACCESS_TOKEN);
const { width, height } = Dimensions.get("window");
export default function App() {
  const mapRef = useRef(null);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text> Work has started!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
