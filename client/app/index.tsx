import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import UserLocationProvider from "./context/userLocation";
import GoogleMapView from "./component/GoogleMapView";
import LaunchScreen from "./component/LaunchScreen"; // Import LaunchScreen

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

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
