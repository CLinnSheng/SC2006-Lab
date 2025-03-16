// index.tsx
import React from "react";
import GoogleMapView from "./component/GoogleMapView";
import BottomSheetContainer from "./component/BottomSheetContainer";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <GoogleMapView />
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
