import { createContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import NearByEVCarPark from "../utils/evChargingStationAPI";
import { ReactNode } from "react";
import processNearbyEVReqPayload from "../utils/processReqPayload";

export const DEFAULT_LOCATION: Location.LocationObjectCoords = {
  latitude: 1.347064,
  longitude: 103.6782468,
  altitude: 0,
  accuracy: 0,
  altitudeAccuracy: 0,
  heading: 0,
  speed: 0,
};

interface UserLocationContextValue {
  userLocation: Location.LocationObjectCoords | null;
  setUserLocation: React.Dispatch<
    React.SetStateAction<Location.LocationObjectCoords | null>
  >;
  loading: boolean;
  getNearbyCarParks: () => Promise<void>;
  getUserLocation: () => Promise<void>;
  recenterRefreshLocation: () => Promise<void>;
  evCarParksList: any[];
  initialProcessedPayload: null;
}

export const UserLocationContext = createContext<UserLocationContextValue>({
  userLocation: null,
  setUserLocation: () => {},
  loading: true,
  getNearbyCarParks: async () => {},
  getUserLocation: async () => {},
  recenterRefreshLocation: async () => {},
  evCarParksList: [],
  initialProcessedPayload: null,
});

const UserLocationProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [evCarParksList, setEvCarParksList] = useState<any[]>([]);
  const [initialProcessedPayload, setInitialProcessedPayload] = useState<
    any | null
  >(null);

  const getUserLocation = async () => {
    setLoading(true);
    try {
      let locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (locationData?.coords) {
        setUserLocation(locationData.coords);
      }

      console.log("User Location Fetched");
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
    setUserLocation(locationData.coords);
    await getNearbyCarParks();
  };

  const getNearbyCarParks = async () => {
    if (!userLocation) return;

    const data = {
      includedTypes: ["electric_vehicle_charging_station"],
      locationRestriction: {
        circle: {
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          radius: 2000.0,
        },
      },
    };

    try {
      const resp = await NearByEVCarPark(data);
      const places = resp.data?.places || [];
      setEvCarParksList(places);

      const processedPayload = processNearbyEVReqPayload(places, userLocation);
      setInitialProcessedPayload(processedPayload);
      console.log("Processed initial nearby req payload");
    } catch (err) {
      console.error("Error fetching car parks:", err);
    }
  };

  useEffect(() => {
    (async () => {
      let finalUserLocation: Location.LocationObjectCoords | null = null;
      let permissionGranted = false;

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        permissionGranted = status === "granted";

        if (status !== "granted") {
          setUserLocation(DEFAULT_LOCATION);
        } else {
          console.log("Fetching user location");
          const locationData = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          if (locationData?.coords) {
            setUserLocation(locationData.coords); // Update state
            console.log("User Location Fetched successfully.");
          } else {
            console.log("Location data or coordinates are null after fetch.");
          }
        }
      } catch (error) {
        console.error("Failed to get current position/location:", error);
      } finally {
        setLoading(false);
        console.log("Location fetching and related tasks completed.");
      }
    })();
  }, []);

  useEffect(() => {
    if (userLocation) {
      console.log("User Location Fetched successfully:", userLocation);
      console.log("Getting nearby car parks (after location fetch)");
      getNearbyCarParks();
    }
  }, [userLocation]);

  return (
    <UserLocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        loading,
        getNearbyCarParks,
        getUserLocation,
        recenterRefreshLocation,
        evCarParksList,
        initialProcessedPayload,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export default UserLocationProvider;