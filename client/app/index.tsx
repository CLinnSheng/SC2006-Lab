// index.tsx
import React, { useState } from "react";
import GoogleMapView from "./component/GoogleMapView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import UserLocationProvider from "./context/userLocation"; // No need to import DEFAULT_LOCATION here
import * as Location from "expo-location";

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <UserLocationProvider>
        <GoogleMapView />
      </UserLocationProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
