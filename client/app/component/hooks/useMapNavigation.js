// hooks/useMapNavigation.tsx
import { useEffect, useState } from "react";
import { decode } from "@googlemaps/polyline-codec";

const useMapNavigation = (mapRef, userLocation, bottomSheetHeight = 0) => {
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedCarPark, setSelectedCarPark] = useState(null);

  const handleCarParkSelection = (carPark) => {
    setSelectedCarPark(carPark);
    console.log("Selected car park for navigation:", carPark);

    if (!carPark) {
      console.warn("No car park selected");
      return;
    }

    if (!userLocation) {
      console.warn("User location is not available");
      return;
    }

    // Extract car park coordinates safely
    const carParkLat =
      carPark.latitude || (carPark.location && carPark.location.latitude);
    const carParkLng =
      carPark.longitude || (carPark.location && carPark.location.longitude);

    if (!carParkLat || !carParkLng) {
      console.warn("Car park location coordinates are missing", carPark);
      return;
    }

    // Create destination object
    const destination = {
      latitude: carParkLat,
      longitude: carParkLng,
    };

    // Check if we have route info
    if (carPark.routeInfo && carPark.routeInfo.polyline) {
      console.log("Route polyline found, fitting route on screen");

      try {
        // Attempt to decode the polyline
        const routePoints = decode(carPark.routeInfo.polyline);

        // Verify we have route points
        if (!routePoints || routePoints.length === 0) {
          console.warn("Decoded polyline contains no points");
          fitTwoPointsOnScreen(userLocation, destination);
          return;
        }

        console.log(`Decoded polyline has ${routePoints.length} points`);

        // Convert decoded points to the format needed for map
        const coordinates = routePoints.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));

        // Make sure we include origin and destination
        const allPoints = [userLocation, ...coordinates, destination];

        // Use edgePadding to ensure markers aren't cut off
        const edgePadding = {
          top: 50,
          right: 50,
          bottom: bottomSheetHeight + 20,
          left: 50,
        };

        // Use the built-in fitToCoordinates method instead of custom calculations
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(allPoints, {
              edgePadding,
              animated: true,
            });
            console.log("Map fitted to coordinates");
          } else {
            console.warn("Map reference is not available");
          }
        }, 100);
      } catch (error) {
        console.error("Error fitting route on screen:", error);
        // Fallback to simple two-point fitting
        fitTwoPointsOnScreen(userLocation, destination);
      }
    } else {
      console.log("No route polyline available, fitting two points");
      fitTwoPointsOnScreen(userLocation, destination);
    }
  };

  // Simplified function to fit just two points (user location and destination)
  const fitTwoPointsOnScreen = (point1, point2) => {
    console.log("Fitting two points on screen:", point1, point2);

    // Use the built-in fitToCoordinates method
    const edgePadding = {
      top: 100,
      right: 100,
      bottom: bottomSheetHeight + 50,
      left: 100,
    };

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.fitToCoordinates([point1, point2], {
          edgePadding,
          animated: true,
        });
        console.log("Map fitted to two points");
      } else {
        console.warn("Map reference is not available for two-point fitting");
      }
    }, 100);
  };

  const handleSearchedLocationFromBar = (location) => {
    setSearchedLocation(location);
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

  // Animate to the searched location
  useEffect(() => {
    if (searchedLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: searchedLocation.lat,
          longitude: searchedLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1500
      );
    }
  }, [searchedLocation]);

  return {
    selectedCarPark,
    searchedLocation,
    handleCarParkSelection,
    handleSearchedLocationFromBar,
    handleRecenterMap,
  };
};

export default useMapNavigation;
