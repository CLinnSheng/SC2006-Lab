import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import GoogleMapView from "../component/GoogleMapView";

export default function HomeScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <GoogleMapView />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
