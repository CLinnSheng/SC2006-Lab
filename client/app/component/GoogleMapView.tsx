import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import BottomSheetContainer from "./BottomSheetContainer";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { UserLocationContext } from "../context/userLocation";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import DEFAULT_LOCATION from "../constants/defaultLocation";
import { decode } from "@googlemaps/polyline-codec";
import useCarParkData from "./hooks/useCarParkData"; // Import the custom hook

const GoogleMapView: React.FC = () => {
  const { carParks } = useCarParkData(() => {});
  const mapRef = useRef<MapView | null>(null);
  const { userLocation } = useContext(UserLocationContext);
  const bottomSheetPosition = useSharedValue<number>(0);
  const maxBottomSheetHeight = parseFloat(
    Platform.OS === "ios"
      ? (0.55 * SCREEN_DIMENSIONS.height).toFixed(1)
      : (0.536 * SCREEN_DIMENSIONS.height).toFixed(1)
  );
  const [searchedLocation, setSearchedLocation] = useState<any>(null); // State for searched location

  const [selectedCarPark, setSelectedCarPark] = useState<any | null>(null);

  const handleCarParkSelection = (carPark: any) => {
    setSelectedCarPark(carPark);
    console.log("Selected car park:", carPark);

    if (carPark && carPark.latitude && carPark.longitude && userLocation) {
      const latDiff = Math.abs(userLocation.latitude - carPark.latitude);
      const lngDiff = Math.abs(userLocation.longitude - carPark.longitude);

      const bufferFactor = 1.5;

      const latDelta = Math.max(latDiff * bufferFactor, 0.005);
      const lngDelta = Math.max(lngDiff * bufferFactor, 0.005);

      const midLat = (userLocation.latitude + carPark.latitude) / 2;
      const midLng = (userLocation.longitude + carPark.longitude) / 2;

      const distanceFactor = Math.min(Math.max(latDiff * 7, 0.005), 0.04); // Limit the max offset
      mapRef.current?.animateToRegion(
        {
          latitude: midLat - distanceFactor,
          longitude: midLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        },
        1500
      );
    }
  };

  const handleRecenterMap = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

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

  const handleSearchedLocationFromBar = (location: any) => {
    setSearchedLocation(location);
    console.log("Searched location received in GoogleMapView:", location);
  };

  // Animate to the searched location
  useEffect(() => {
    if (searchedLocation) {
      console.log("Animating to searched location:", searchedLocation);
      mapRef.current?.animateToRegion(
        {
          latitude: searchedLocation.lat,
          longitude: searchedLocation.lng,
          latitudeDelta: 0.01, // Adjust delta for desired zoom level
          longitudeDelta: 0.01,
        },
        1500 // Animation duration in milliseconds
      );
    }
  }, [searchedLocation]); // Re-run when searchedLocation changes

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
          {!selectedCarPark && carParks?.map((carPark, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: carPark.latitude,
                longitude: carPark.longitude,
              }}
              title={carPark.address}
              onPress={() => {
                console.log("Marker pressed:", carPark);
              }}
            />
          ))}

          {/* Render markers for each car park */}
          {selectedCarPark && (
            <Marker
              coordinate={{
                latitude: selectedCarPark.latitude,
                longitude: selectedCarPark.longitude,
              }}
              title={selectedCarPark.address}
              description={`Type: ${selectedCarPark.carParkType || "Unknown"}`}
              pinColor={selectedCarPark.type === "CarPark" ? "red" : "blue"}
              onPress={() => handleCarParkSelection(selectedCarPark)}
            />
          )}

          {selectedCarPark && selectedCarPark.routeInfo.polyline && (
            <>
              {/* Polyline to show the route */}
              <Polyline
                coordinates={decode(selectedCarPark.routeInfo.polyline).map(
                  (point: any) => ({
                    latitude: point[0],
                    longitude: point[1],
                  })
                )}
                strokeWidth={6}
                strokeColor="#007AFF"
              />

              {/* Marker at the end of the polyline, only if type is NOT "CarPark" */}
              {selectedCarPark.type !== "CarPark" &&
                decode(selectedCarPark.routeInfo.polyline).length > 0 && (
                  <Marker
                    coordinate={{
                      latitude: decode(
                        selectedCarPark.routeInfo.polyline
                      ).slice(-1)[0][0],
                      longitude: decode(
                        selectedCarPark.routeInfo.polyline
                      ).slice(-1)[0][1],
                    }}
                    title="Destination"
                    description="End of the route"
                    pinColor="blue" // Green marker for non-CarPark destinations
                  />
                )}
            </>
          )}
        </MapView>
        <Animated.View style={[animatedButtonStyle, styles.myLocationButton]}>
          <TouchableOpacity onPress={handleRecenterMap}>
            <Ionicons name="locate" size={24} color="#007AFF" />
          </TouchableOpacity>
        </Animated.View>
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
  myLocationButton: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    right: 15,
    bottom:
      Platform.OS === "ios"
        ? SCREEN_DIMENSIONS.height * 0.462
        : SCREEN_DIMENSIONS.height * 0.445,
  },
});

export default GoogleMapView;
