import React, { useEffect, useRef, useState } from "react";
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
import SearchBar from "./SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const DEFAULT_LOCATION: Location.LocationObjectCoords = {
  latitude: 1.2838,
  longitude: 103.8591,
  altitude: 0,
  accuracy: 0,
  altitudeAccuracy: 0,
  heading: 0,
  speed: 0,
};

const GoogleMapView: React.FC = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(location.coords);
      } else {
        setLocation(DEFAULT_LOCATION);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocation(DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  };

  // Set up a location subscription when the component mounts
  useEffect(() => {
    getCurrentLocation();

    // Set up location updates
    let locationSubscription: Location.LocationSubscription;

    const setupLocationUpdates = async () => {
      // Watch position changes
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    };

    setupLocationUpdates();

    // Cleanup subscription on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
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
  
  return (
    <GestureHandlerRootView style={styles.container}>
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
          {/* <SearchBar /> */}
          <TouchableOpacity 
              style={styles.myLocationButton}
              onPress={handleRecenterMap}
            >
              <Ionicons name="locate" size={24} color="#007AFF" />
            </TouchableOpacity>
        </>
      )}
      <BottomSheetContainer mapRef={mapRef}/>
    </View>
    </GestureHandlerRootView>
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
    bottom: 160, // Positioned above the bottom sheet
    right: 16,
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
  },
});

export default GoogleMapView;
