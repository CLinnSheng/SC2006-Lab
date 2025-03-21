import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import BottomSheetContainer from "./BottomSheetContainer";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { UserLocationContext } from "../context/userLocation";
import NewNearByCarPark from "../utils/carParkAvaiApi";
const deviceHeight = Dimensions.get("window").height;

const DEFAULT_LOCATION: Location.LocationObjectCoords = {
  latitude: 1.347064,
  longitude: 103.6782468,
  altitude: 0,
  accuracy: 0,
  altitudeAccuracy: 0,
  heading: 0,
  speed: 0,
};

const GoogleMapView: React.FC = () => {
  const { location, setLocation } = useContext(UserLocationContext); // Use context instead of local state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  const getNearByCarPark = () => {
    const data = {
      includedTypes: ["parking", "electric_vehicle_charging_station"],
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 5000.0,
        },
      },
    };
    NewNearByCarPark(data)
    .then((res: any) => {
      console.log(res);
      console.log("Nearby Car Park");
    })
    .catch((err) => console.error("Error fetching car parks:", err));
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(location.coords);
        console.log(location);
        setTimeout(() => getNearByCarPark(), 0);
      } catch (error) {
        setErrorMsg("Failed to get current position/location");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRecenterMap = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const bottomSheetPosition = useSharedValue<number>(0);
  const maxBottomSheetHeight = parseFloat((0.58487 * deviceHeight).toFixed(1));

  // Animate the button to stay above the BottomSheet
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
      {loading ? (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              latitude: location?.latitude ?? DEFAULT_LOCATION.latitude,
              longitude: location?.longitude ?? DEFAULT_LOCATION.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            // provider={PROVIDER_GOOGLE}
          />
          <Animated.View style={[animatedButtonStyle, styles.myLocationButton]}>
            <TouchableOpacity onPress={handleRecenterMap}>
              <Ionicons name="locate" size={24} color="#007AFF" />
            </TouchableOpacity>
          </Animated.View>
          <BottomSheetContainer bottomSheetPosition={bottomSheetPosition} />
        </>
      )}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: deviceHeight,
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
    bottom: 395,
  },
});

export default GoogleMapView;
