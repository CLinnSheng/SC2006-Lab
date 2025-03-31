import { createContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import NearByEVCarPark from "../utils/evChargingStationAPI";
import { ReactNode } from "react";
import processNearbyEVReqPayload from "../utils/processReqPayload";
import DEFAULT_LOCATION from "../constants/defaultLocation";

interface UserLocationContextValue {
  userLocation: Location.LocationObjectCoords | null;
  setUserLocation: React.Dispatch<
    React.SetStateAction<Location.LocationObjectCoords | null>
  >;
  getNearbyCarParks: (location?: {
    latitude: number;
    longitude: number;
  }) => Promise<void>; // getUserLocation: () => Promise<void>;
  initialProcessedPayload: any | null;
  searchedLocationPayload: any | null; // For searched location
  isShowingSearchedLocation: boolean; // To track current display state
  resetToUserLocation: () => void; // Function to reset to user location
  initializeAfterLaunch: () => Promise<void>; // New function to initialize after animation
  setIsShowingSearchedLocation: () => void;
}

export const UserLocationContext = createContext<UserLocationContextValue>({
  userLocation: null,
  setUserLocation: () => {},
  getNearbyCarParks: async () => {},
  // getUserLocation: async () => {},
  // recenterRefreshLocation: async () => {},
  initialProcessedPayload: null,
  searchedLocationPayload: null,
  isShowingSearchedLocation: false,
  resetToUserLocation: () => {},
  initializeAfterLaunch: async () => {}, // Initialize default
  setIsShowingSearchedLocation: () => {},
});

const UserLocationProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [initialProcessedPayload, setInitialProcessedPayload] = useState<
    any | null
  >(null);
  const [searchedLocationPayload, setSearchedLocationPayload] = useState<
    any | null
  >(null);
  const [isShowingSearchedLocation, setIsShowingSearchedLocation] =
    useState(false);
  const [initialized, setInitialized] = useState(false);

  const getNearbyCarParks = async (location?: {
    latitude: number;
    longitude: number;
  }) => {
    const targetLocation = location || userLocation;
    if (!targetLocation) return;

    const data = {
      includedTypes: ["electric_vehicle_charging_station"],
      locationRestriction: {
        circle: {
          center: {
            latitude: targetLocation.latitude,
            longitude: targetLocation.longitude,
          },
          radius: 2000.0,
        },
      },
    };

    try {
      console.log("Fetching nearby ev car parks...");
      const resp = await NearByEVCarPark(data);
      const places = resp.data?.places || [];

      // const processedPayload = processNearbyEVReqPayload(
      //   places,
      //   targetLocation
      // );

      const processedPayload = processNearbyEVReqPayload(
        places,
        targetLocation,
        userLocation
      );
      
      if (location) {
        setSearchedLocationPayload(processedPayload);
        setIsShowingSearchedLocation(true);
      } else {
        setInitialProcessedPayload(processedPayload);
        setIsShowingSearchedLocation(false);
      }
    } catch (err) {
      console.error("Error fetching car parks:", err);
    }
  };

  const initializeAfterLaunch = async () => {
    console.log("Initializing location after launch animation...");

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission not granted, using default location");
        setUserLocation(DEFAULT_LOCATION);
      } else {
        console.log("Location permission granted, fetching user location");
        const locationData = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (locationData?.coords) {
          setUserLocation(locationData.coords);
          console.log("User Location Fetched successfully.");
        } else {
          console.log("Location data or coordinates are null after fetch.");
        }
      }
    } catch (error) {
      console.error("Failed to get current position/location:", error);
    } finally {
      setInitialized(true);
      console.log("Location initialization completed.");
    }
  };

  // get nearby carpark after the userlocatoin state is saved
  useEffect(() => {
    if (userLocation) {
      console.log("User Location Saved successfully");
      getNearbyCarParks();
      console.log("Finished fetching nearby car parks (EV)");
    }
  }, [userLocation]);

  // handling when user cancel search, show back current user nearby carpark
  const resetToUserLocation = () => {
    setIsShowingSearchedLocation(false);
    if (userLocation) {
      getNearbyCarParks(); // This will fetch for user location
    }
  };

  return (
    <UserLocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        getNearbyCarParks,
        // getUserLocation,
        // recenterRefreshLocation,
        initialProcessedPayload,
        initializeAfterLaunch,
        searchedLocationPayload,
        isShowingSearchedLocation,
        resetToUserLocation,
        setIsShowingSearchedLocation: () => {
          setIsShowingSearchedLocation(true);
        },
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export default UserLocationProvider;
