// index.tsx
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Dimensions, View } from "react-native";
import GoogleMapView from "./component/GoogleMapView";

const App: React.FC = () => {
  return (
      <GoogleMapView />
  );
};

export default App;
