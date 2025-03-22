import { createContext } from "react";
import * as Location from "expo-location";

interface UserLocationContextValue {
  location: Location.LocationObjectCoords;
  setLocation: React.Dispatch<
    React.SetStateAction<Location.LocationObjectCoords>
  >;
}

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

export const UserLocationContext = createContext<UserLocationContextValue>({
  location: DEFAULT_LOCATION,
  setLocation: () => {},
});
