import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import * as Location from "expo-location";

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

  useEffect(() => {
    const requestLocationPermission = async () => {
      // First check current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      // If already denied, show custom alert
      if (existingStatus === 'denied') {
        Alert.alert(
          "Location Permission Required",
          "Please enable location permissions in your device settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
        setLocation(DEFAULT_LOCATION);
        return;
      }
      
      // Otherwise request permission normally
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        setLocation(DEFAULT_LOCATION);
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    };
    
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && (
        <StatusBar translucent backgroundColor="transparent" />
      )}
      {location && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: deviceHeight,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GoogleMapView;
