// hooks/useMapNavigation.tsx
import { useEffect, useState } from 'react';
import { MapView } from 'react-native-maps';

const useMapNavigation = (mapRef, userLocation) => {
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedCarPark, setSelectedCarPark] = useState(null);

  const handleCarParkSelection = (carPark) => {
    setSelectedCarPark(carPark);
    
    if (carPark && carPark.latitude && carPark.longitude && userLocation) {
      const latDiff = Math.abs(userLocation.latitude - carPark.latitude);
      const lngDiff = Math.abs(userLocation.longitude - carPark.longitude);

      const bufferFactor = 1.5;
      const latDelta = Math.max(latDiff * bufferFactor, 0.005);
      const lngDelta = Math.max(lngDiff * bufferFactor, 0.005);

      const midLat = (userLocation.latitude + carPark.latitude) / 2;
      const midLng = (userLocation.longitude + carPark.longitude) / 2;

      const distanceFactor = Math.min(Math.max(latDiff * 7, 0.005), 0.04);
      
      mapRef.current?.animateToRegion(
        {
          latitude: midLat - distanceFactor,
          longitude: midLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        },
        1500
      );
    }
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
    handleRecenterMap
  };
};

export default useMapNavigation;