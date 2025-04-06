import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { UserLocationContext } from "../../context/userLocation";

const useCarParkData = (
  setSearchedLocationFromMap: (location: any) => void
) => {
  const [searchedLocation, setSearchedLocation] = useState<any>(null);
  const [carParks, setCarParks] = useState<any[]>([]);
  const [EVLots, setEVLots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    initialProcessedPayload,
    getNearbyCarParks,
    searchedLocationPayload,
    isShowingSearchedLocation,
  } = useContext(UserLocationContext);

  const combinedListCarPark = useMemo(() => {
    return [
      ...(carParks ?? []).map((item) => ({ ...item, type: "CarPark" })),
      // Always include EV lots in the combined list
      // The useCarParkFilters hook will handle EV filtering
      ...(EVLots ?? []).map((item) => ({ ...item, type: "EV" })),
    ];
  }, [carParks, EVLots]);

  const currentPayload = useMemo(() => {
    return isShowingSearchedLocation
      ? searchedLocationPayload
      : initialProcessedPayload;
  }, [isShowingSearchedLocation, searchedLocationPayload, initialProcessedPayload]);

  const handleSearchedLocation = useCallback(
    (location: any) => {
      console.log("Searched location received in BottomSheetContainer");
      setSearchedLocation(location);
      setSearchedLocationFromMap(location);
      getNearbyCarParks({ latitude: location.lat, longitude: location.lng });
    },
    [getNearbyCarParks, setSearchedLocationFromMap]
  );

  const fetchNearByCarParks = useCallback(async (payload: any) => {
    if (!payload) {
      console.log("No payload available for fetching nearby car parks, skipping request");
      return;
    }

    // Cancel any previous requests or timeouts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Aborted previous request");
    }
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    // Set up debounced fetch with timeout
    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        
        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        console.log("Fetching nearby car parks from /api/carpark/nearby/");

        const resp = await axios.post(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:${process.env.EXPO_PUBLIC_SERVER_PORT}/api/carpark/nearby/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            signal: abortControllerRef.current.signal,
          }
        );

        console.log("Fetched nearby car parks from /api/carpark/nearby/");
        setCarParks(resp.data.CarPark);
        setEVLots(resp.data.EV);
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.log("Error fetching car parks:", error.message);
        }
      } finally {
        setIsLoading(false);
        fetchTimeoutRef.current = null;
      }
    }, 150); // 150ms debounce
  }, []);

  // Single effect to handle all fetch triggers
  useEffect(() => {
    if (!currentPayload) {
      return;
    }

    console.log("Payload changed, fetching car parks");
    fetchNearByCarParks(currentPayload);

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        console.log("Aborted fetch request due to unmount or dependency change");
      }
      
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [currentPayload, fetchNearByCarParks]);

  return {
    carParks,
    EVLots,
    combinedListCarPark,
    searchedLocation,
    setSearchedLocation,
    handleSearchedLocation,
    isLoading,
  };
};

export default useCarParkData;