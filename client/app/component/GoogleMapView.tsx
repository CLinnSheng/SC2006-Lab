import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, {
  Polyline,
  PROVIDER_GOOGLE,
  Marker,
  Callout,
} from "react-native-maps";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
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
import WeatherButton from "./WeatherButton"; // Import the InfoButton component
import getStreetViewUrl from "./hooks/getStreetViewImage";

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
          {!selectedCarPark &&
            combinedListCarPark?.map((lot, index) => {
              const latitude = lot.latitude ?? lot.location?.latitude ?? 0;
              const longitude = lot.longitude ?? lot.location?.longitude ?? 0;

              return (
                <Marker
                  key={index}
                  coordinate={{ latitude, longitude }}
                  pinColor={lot.type === "EV" ? "green" : "red"} // color-coded
                  onPress={() => {
                    // console.log("Marker pressed:", lot);
                  }}
                >
                  <Callout tooltip>
                    <View
                      style={{
                        width: 200,
                        padding: 10,
                        backgroundColor: "white",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{ fontWeight: "bold", marginBottom: 5 }}
                        numberOfLines={1}
                      >
                        {lot.displayName ??
                          lot.address ??
                          lot.shortFormattedAddress}
                      </Text>
                      <Image
                        source={{
                          uri: getStreetViewUrl(latitude, longitude),
                        }}
                        style={{ width: "100%", height: 100, borderRadius: 5 }}
                        resizeMode="cover"
                      />
                    </View>
                  </Callout>
                </Marker>
              );
            })}

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
              <Marker
                coordinate={{
                  latitude:
                    selectedCarPark.latitude ??
                    selectedCarPark.location?.latitude,
                  longitude:
                    selectedCarPark.longitude ??
                    selectedCarPark.location?.longitude,
                }}
                pinColor={selectedCarPark.type === "CarPark" ? "red" : "blue"}
                onPress={() => {}}
                ref={(ref) => {
                  if (ref) {
                    // Automatically show the callout when the marker is rendered
                    setTimeout(() => ref.showCallout(), 100);
                  }
                }}
              ></Marker>
            </>
          )}
        </MapView>

        {/* Info Button Component - all configuration is in InfoButton.tsx */}
        <WeatherButton bottomSheetPosition={bottomSheetPosition} />

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
