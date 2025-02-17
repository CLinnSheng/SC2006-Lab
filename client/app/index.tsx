// index.tsx
import React from "react";
import MapComponent from "./component/Map"; // Adjust the path as necessary
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Dimensions, View } from "react-native";

const App: React.FC = () => {
  return (
      <MapComponent />
  );
};

export default App;
