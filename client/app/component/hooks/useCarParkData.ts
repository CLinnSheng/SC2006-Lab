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
  const apiBaseUrl = useMemo(() => {
    return `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:${process.env.EXPO_PUBLIC_SERVER_PORT}`;
  }, []);

  const {
    initialProcessedPayload,
    getNearbyCarParks,
    searchedLocationPayload,
    isShowingSearchedLocation,
  } = useContext(UserLocationContext);

  const combinedListCarPark = useMemo(() => {
    if (!carParks.length && !EVLots.length) return [];

    console.log("Fetched car parks and EV lots");
    return [
      ...(carParks ?? []).map((item) => ({ ...item, type: "CarPark" })),
      ...(EVLots ?? []).map((item) => ({ ...item, type: "EV" })),
    ];
  }, [carParks, EVLots]);

  const currentPayload = useMemo(() => {
    return isShowingSearchedLocation
      ? searchedLocationPayload
      : initialProcessedPayload;
  }, [
    isShowingSearchedLocation,
    searchedLocationPayload,
    initialProcessedPayload,
  ]);

  const handleSearchedLocation = useCallback(
    (location: any) => {
      console.log("Searched location received in BottomSheetContainer");
      setSearchedLocation(location);
      setSearchedLocationFromMap(location);
      getNearbyCarParks({ latitude: location.lat, longitude: location.lng });
      setIsLoading(true);
      setCarParks([]);
      setEVLots([]);
    },
    [getNearbyCarParks, setSearchedLocationFromMap]
  );

  const api = useMemo(() => {
    return axios.create({
      baseURL: apiBaseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, [apiBaseUrl]);
  const cancelPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
  }, []);
  const fetchNearByCarParks = useCallback(
    async (payload: any) => {
      if (!payload) {
        return;
      }

      // Cancel any previous requests or timeouts
      cancelPreviousRequest();

      // Set up debounced fetch with timeout - use a shorter timeout for better responsiveness
      fetchTimeoutRef.current = setTimeout(async () => {
        try {
          setIsLoading(true);

          abortControllerRef.current = new AbortController();

          const resp = await api.post("/api/carpark/nearby/", payload, {
            signal: abortControllerRef.current.signal,
          });

          // Only update state if we have valid data
          if (resp.data && resp.status === 200) {
            setCarParks(resp.data.CarPark || []);
            setEVLots(resp.data.EV || []);
          }
        } catch (error: any) {
          if (axios.isCancel(error)) {
          } else {
            console.error("Error fetching car parks:", error);
          }
        } finally {
          setIsLoading(false);
          fetchTimeoutRef.current = null;
        }
      }, 100);
    },
    [api, cancelPreviousRequest]
  );

  // Single effect to handle all fetch triggers
  useEffect(() => {
    if (!currentPayload) {
      return;
    }

    console.log("Payload changed, fetching car parks");
    fetchNearByCarParks(currentPayload);

    return cancelPreviousRequest;
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
