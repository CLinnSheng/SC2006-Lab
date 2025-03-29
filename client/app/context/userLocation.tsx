import { createContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import NearByEVCarPark from "../utils/evChargingStationAPI";
import { ReactNode } from "react";
import processNearbyEVReqPayload from "../utils/processReqPayload";
import  DEFAULT_LOCATION  from "../constants/defaultLocation";

interface UserLocationContextValue {
  userLocation: Location.LocationObjectCoords | null;
  setUserLocation: React.Dispatch<
    React.SetStateAction<Location.LocationObjectCoords | null>
  >;
  loading: boolean;
  getNearbyCarParks: () => Promise<void>;
  // getUserLocation: () => Promise<void>;
  // recenterRefreshLocation: () => Promise<void>;
  // evCarParksList: any[];
  initialProcessedPayload: any | null;
  initializeAfterLaunch: () => Promise<void>; // New function to initialize after animation
}

export const UserLocationContext = createContext<UserLocationContextValue>({
  userLocation: null,
  setUserLocation: () => {},
  loading: true,
  getNearbyCarParks: async () => {},
  // getUserLocation: async () => {},
  // recenterRefreshLocation: async () => {},
  // evCarParksList: [],
  initialProcessedPayload: null,
  initializeAfterLaunch: async () => {}, // Initialize default
});

const UserLocationProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  // const [evCarParksList, setEvCarParksList] = useState<any[]>([]);
  const [initialProcessedPayload, setInitialProcessedPayload] = useState<
    any | null
  >(null);
  const [initialized, setInitialized] = useState(false);

  // const getUserLocation = async () => {
  //   setLoading(true);
  //   try {
  //     let locationData = await Location.getCurrentPositionAsync({
  //       accuracy: Location.Accuracy.High,
  //     });

  //     if (locationData?.coords) {
  //       setUserLocation(locationData.coords);
  //     }

  //     console.log("User Location Fetched");
  //   } catch (error) {
  //     console.warn("Failed to fetch user location");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const recenterRefreshLocation = async () => {
  //   let locationData = await Location.getCurrentPositionAsync({
  //     accuracy: Location.Accuracy.High,
  //   });
  //   setUserLocation(locationData.coords);
  //   await getNearbyCarParks();
  // };

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
      console.log("Fetching nearby ev car parks...");
      const resp = await NearByEVCarPark(data);
      const places = resp.data?.places || [];

      const processedPayload = processNearbyEVReqPayload(places, userLocation);
      setInitialProcessedPayload(processedPayload);
      console.log("Processed initial nearby req payload");
    } catch (err) {
      console.error("Error fetching car parks:", err);
    }
  };

  const initializeAfterLaunch = async () => {
    console.log("Initializing location after launch animation...");
    setLoading(true);

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
          setUserLocation(DEFAULT_LOCATION);
        }
      }
    } catch (error) {
      console.error("Failed to get current position/location:", error);
      setUserLocation(DEFAULT_LOCATION);
    } finally {
      setLoading(false);
      setInitialized(true);
      console.log("Location initialization completed.");
      getNearbyCarParks();
    }
  };

  useEffect(() => {
    console.log(DEFAULT_LOCATION);
    if (userLocation) {
      console.log("User Location Saved successfully");
      getNearbyCarParks();
      console.log("Finished fetching nearby car parks (EV)");
    }
  }, [userLocation]);

  return (
    <UserLocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        loading,
        getNearbyCarParks,
        // getUserLocation,
        // recenterRefreshLocation,
        // evCarParksList,
        initialProcessedPayload,
        initializeAfterLaunch,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export default UserLocationProvider;
