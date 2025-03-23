// index.tsx
import React, { useState } from "react";
import GoogleMapView from "./component/GoogleMapView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { DEFAULT_LOCATION, UserLocationContext, UserLocationProvider } from "./context/userLocation";
import * as Location from "expo-location";

const App: React.FC = () => {
  // const [location, setLocation] = useState<Location.LocationObjectCoords>(DEFAULT_LOCATION);
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <UserLocationContext.Provider value={{ location, setLocation }}> */}
      <UserLocationProvider>
        <GoogleMapView />
      {/* </UserLocationContext.Provider> */}
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
