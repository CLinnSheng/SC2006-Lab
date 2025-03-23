import { createContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import NearByEVCarPark from "../utils/evChargingStationAPI";
import { ReactNode } from "react";
import { Alert, Linking } from "react-native";

// interface UserLocationContextValue {
//   location: Location.LocationObjectCoords;
//   setLocation: React.Dispatch<
//     React.SetStateAction<Location.LocationObjectCoords>
//   >;
// }

export const DEFAULT_LOCATION: Location.LocationObjectCoords = {
  latitude: 1.347064,
  longitude: 103.6782468,
  // ev default location
  //   latitude: 1.3192389,
  //   longitude: 103.6864955,
  altitude: 0,
  accuracy: 0,
  altitudeAccuracy: 0,
  heading: 0,
  speed: 0,
};

// export const UserLocationContext = createContext<UserLocationContextValue>({
//   location: DEFAULT_LOCATION,
//   setLocation: () => {},
// });

interface UserLocationContextValue {
  location: Location.LocationObjectCoords | null;
  setLocation: React.Dispatch<
    React.SetStateAction<Location.LocationObjectCoords | null>
  >;
  errorMsg: string | null;
  loading: boolean;
  getNearbyCarParks: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  recenterRefreshLocation: () => Promise<void>;
}

export const UserLocationContext = createContext<UserLocationContextValue>({
  location: null,
  setLocation: () => {},
  errorMsg: null,
  loading: true,
  getNearbyCarParks: async () => {},
  refreshLocation: async () => {},
  recenterRefreshLocation: async () => {},
});

export const UserLocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(DEFAULT_LOCATION);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const showLocationPermissionAlert = () => {
    Alert.alert(
      "Location Permission Denied",
      "Please enable location services to use this app.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(),
        },
      ],
      { cancelable: false }
    );
  };

  const refreshLocation = async () => {
    setLoading(true);
    try {
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(locationData.coords);

      console.log("Location refreshed");
      console.log(location);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg("Failed to refresh location");
      setLocation(DEFAULT_LOCATION);

      console.log("Failed to refresh location");
    } finally {
      setLoading(false);
    }
  };

  const recenterRefreshLocation = async () => {
    let locationData = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation(locationData.coords);
    await getNearbyCarParks();
  };

  const getNearbyCarParks = async () => {
    if (!location) return;

    const data = {
      includedTypes: ["electric_vehicle_charging_station"],
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 2000.0,
        },
      },
    };

    try {
      const res = await NearByEVCarPark(data);
      console.log("Nearby Car Park");
      console.log(res);
      console.log("Fetched nearby car parks");
    } catch (err) {
      console.error("Error fetching car parks:", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          showLocationPermissionAlert();
          return;
        }

        console.log("Getting current position");
        await refreshLocation();

        console.log("Getting nearby car parks");
        await getNearbyCarParks();
      } catch (error) {
        setErrorMsg("Failed to get current position/location");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <UserLocationContext.Provider
      value={{
        location,
        setLocation,
        errorMsg,
        loading,
        getNearbyCarParks,
        refreshLocation,
        recenterRefreshLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};
