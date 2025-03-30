import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import UserLocationProvider from "./context/userLocation";
import GoogleMapView from "./component/GoogleMapView";
import LaunchScreen from "./component/LaunchScreen"; // Import LaunchScreen
import { LogBox } from 'react-native';
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Text strings must be rendered within a <Text> component")
  ) {
    return; // Ignore this specific warning
  }
  originalConsoleError(...args); // Allow other errors to be logged
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    LogBox.ignoreLogs([
      "Warning: Text strings must be rendered within a <Text> component",
    ]);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <UserLocationProvider>
        {isLoading ? <LaunchScreen onFinish={() => setIsLoading(false)} /> : <GoogleMapView />}
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
