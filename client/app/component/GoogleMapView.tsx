import React, { useContext, useEffect, useRef, useState } from "react";
import MapView from "react-native-maps";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import BottomSheetContainer from "./BottomSheetContainer";
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { UserLocationContext } from "../context/userLocation";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import DEFAULT_LOCATION from "../constants/defaultLocation";
import useCarParkData from "./hooks/useCarParkData"; // Import the custom hook
import WeatherButton from "./WeatherButton"; // Import the InfoButton component
import RecenterButton from "./RecenterButton";
import RouteDisplay from "./RouteDisplay";
import MapMarkers from "./MapMarkers";
import useMapNavigation from "./hooks/useMapNavigation";
const GoogleMapView: React.FC = () => {
  const { carParks, combinedListCarPark } = useCarParkData(() => {});
  const mapRef = useRef<MapView | null>(null);
  const { userLocation } = useContext(UserLocationContext);
  const bottomSheetPosition = useSharedValue<number>(0);
  const maxBottomSheetHeight = parseFloat(
    Platform.OS === "ios"
      ? (0.55 * SCREEN_DIMENSIONS.height).toFixed(1)
      : (0.536 * SCREEN_DIMENSIONS.height).toFixed(1)
  );

  const {
    selectedCarPark,
    searchedLocation,
    handleCarParkSelection,
    handleSearchedLocationFromBar,
    handleRecenterMap,
  } = useMapNavigation(mapRef, userLocation);

  // Animate the recenter map button to stay above the BottomSheet
  const animatedButtonStyle = useAnimatedStyle(() => {
    const translateY =
      bottomSheetPosition.value <= maxBottomSheetHeight
        ? 0 // Keep static at 40% and above
        : (bottomSheetPosition.value - maxBottomSheetHeight) * 1; // Move downward dynamically

    // Fade out when above 40%
    const opacity = interpolate(
      bottomSheetPosition.value,
      [maxBottomSheetHeight, maxBottomSheetHeight - 100], // Adjust range to smooth transition
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && (
        <StatusBar translucent backgroundColor="transparent" />
      )}
      <>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation
          showsMyLocationButton={false}
          initialRegion={{
            latitude: userLocation?.latitude ?? DEFAULT_LOCATION.latitude,
            longitude: userLocation?.longitude ?? DEFAULT_LOCATION.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          // customMapStyle={mapViewStyle}
          // provider={PROVIDER_GOOGLE}
        >
          <MapMarkers
            carParks={combinedListCarPark}
            isVisible={!selectedCarPark}
          />

          {selectedCarPark && selectedCarPark.routeInfo.polyline && (
            <RouteDisplay selectedCarPark={selectedCarPark} />
          )}
        </MapView>

        {/* Info Button Component - all configuration is in InfoButton.tsx */}
        <WeatherButton bottomSheetPosition={bottomSheetPosition} />

        {/* Recenter Button */}
        <RecenterButton
          bottomSheetPosition={bottomSheetPosition}
          maxBottomSheetHeight={maxBottomSheetHeight}
          onPress={handleRecenterMap}
        />
        <BottomSheetContainer
          bottomSheetPosition={bottomSheetPosition}
          searchedLocation={handleSearchedLocationFromBar}
          onSelectCarPark={handleCarParkSelection}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GoogleMapView;
