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
  // errorMsg: string | null;
  loading: boolean;
  getNearbyCarParks: () => Promise<void>;
  getUserLocation: () => Promise<void>;
  recenterRefreshLocation: () => Promise<void>;
  evCarParksList: any[];
}

export const UserLocationContext = createContext<UserLocationContextValue>({
  location: null,
  setLocation: () => {},
  loading: true,
  getNearbyCarParks: async () => {},
  getUserLocation: async () => {},
  recenterRefreshLocation: async () => {},
  evCarParksList: [],
});

export const UserLocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [evCarParksList, setEvCarParksList] = useState<any[]>([]);

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

  const getUserLocation = async () => {
    setLoading(true);
    try {
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (locationData?.coords) {
        console.log("User Location:", locationData.coords);
        setLocation(locationData.coords);
      }

      console.log("User Location Fetched");
      console.log(location);
    } catch (error) {
      console.warn("Failed to fetch user location");
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
      NearByEVCarPark(data).then((resp: any) => {
        console.log(JSON.stringify(resp));
        setEvCarParksList(resp.data?.places);
      });
    } catch (err) {
      console.error("Error fetching car parks:", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLoading(false);
          // showLocationPermissionAlert();
          return;
        }

        console.log("Fetching user location");
        await getUserLocation();

        console.log("Getting nearby car parks");
        await getNearbyCarParks();
      } catch (error) {
        // setErrorMsg("Failed to get current position/location");
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
        loading,
        getNearbyCarParks,
        getUserLocation,
        recenterRefreshLocation,
        evCarParksList,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};
