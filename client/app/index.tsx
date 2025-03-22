// index.tsx
import React, { useState } from "react";
import GoogleMapView from "./component/GoogleMapView";
import LaunchScreen from "./component/LaunchScreen";
import BottomSheetContainer from "./component/BottomSheetContainer";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import 'react-native-get-random-values';



const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <GestureHandlerRootView style={styles.container}>
      {isLoading ? <LaunchScreen onFinish={() => setIsLoading(false)} /> : <GoogleMapView />}
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