import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { UserLocationContext } from "../../context/userLocation";

const useCarParkData = (
  setSearchedLocationFromMap: (location: any) => void
) => {
  const [searchedLocation, setSearchedLocation] = useState<any>(null);
  const [carParks, setCarParks] = useState<any[]>([]);
  const [EVLots, setEVLots] = useState<any[]>([]);

  const {
    initialProcessedPayload,
    getNearbyCarParks,
    searchedLocationPayload,
    isShowingSearchedLocation,
  } = useContext(UserLocationContext);

  const combinedListCarPark = useMemo(() => {
    return [
      ...(carParks ?? []).map((item) => ({ ...item, type: "CarPark" })),
      ...(EVLots ?? []).map((item) => ({ ...item, type: "EV" })),
    ];
  }, [carParks, EVLots]);

  const handleSearchedLocation = (location: any) => {
    console.log("Searched location received in BottomSheetContainer");
    setSearchedLocation(location);
    setSearchedLocationFromMap(location);
    getNearbyCarParks({ latitude: location.lat, longitude: location.lng });
  };

  const fetchNearByCarParks = async () => {
    console.log("Fetching nearby car parks from /api/carpark/nearby/");
    try {
      const payloadToUse = isShowingSearchedLocation
        ? searchedLocationPayload
        : initialProcessedPayload;
      if (!payloadToUse) return;

      const resp = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:${process.env.EXPO_PUBLIC_SERVER_PORT}/api/carpark/nearby/`,
        payloadToUse,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Fetched nearby car parks from /api/carpark/nearby/");
      setCarParks(resp.data.CarPark);
      setEVLots(resp.data.EV);
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  // fetch nearby car park for handling user location and searched location
  useEffect(() => {
    if (initialProcessedPayload || searchedLocationPayload) {
      console.log("Started fetching nearby car parks");
      fetchNearByCarParks();
    }
  }, [
    initialProcessedPayload,
    searchedLocationPayload,
    isShowingSearchedLocation,
  ]);

  return {
    carParks,
    EVLots,
    combinedListCarPark,
    searchedLocation,
    setSearchedLocation,
    handleSearchedLocation,
  };
};

export default useCarParkData;
