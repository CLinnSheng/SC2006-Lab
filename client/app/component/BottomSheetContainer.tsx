import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";
import { UserLocationContext } from "../context/userLocation";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import SCREEN_DIMENSIONS from "../constants/screenDimension";

const BottomSheetContainer = ({
  bottomSheetPosition,
  searchedLocation: setSearchedLocationFromMap,
}: {
  bottomSheetPosition: SharedValue<number>;
  searchedLocation: (location: any) => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const selectedCarParkBottomSheetRef = useRef<BottomSheet>(null);

  const searchBarRef = useRef<{ clearInput: () => void }>(null);

  const snapPoints = useMemo(() => ["10%", "40%", "93%"], []);
  const [currentIndex, setCurrentIndex] = useState(1);

  const {
    initialProcessedPayload,
    userLocation,
    getNearbyCarParks,
    searchedLocationPayload,
    isShowingSearchedLocation,
    resetToUserLocation,
  } = useContext(UserLocationContext);

  const [searchedLocation, setSearchedLocation] = useState<any>(null);

  const [carParks, setCarParks] = useState<any[]>([]);
  const [EVLots, setEVLots] = useState<any[]>([]);

  const combinedListCarPark = useMemo(() => {
    return [
      ...(carParks ?? []).map((item) => ({ ...item, type: "CarPark" })),
      ...(EVLots ?? []).map((item) => ({ ...item, type: "EV" })),
    ];
  }, [carParks, EVLots]);

  const handleSearchedLocation = (location: any) => {
    console.log("Searched location received in BottomSheetContainer");
    setSearchedLocation(location);
    setSearchedLocationFromMap(location); // for animation
    getNearbyCarParks({ latitude: location.lat, longitude: location.lng });
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    setCurrentIndex(index);
    if (index < 2) {
      Keyboard.dismiss();
    }
  }, []);

  const handleSheetChanges_SelectedCarPark = useCallback((index: number) => {
    console.log("handleSheetChanges_SelectedCarPark", index);
    // bottomSheetRef.current?.snapToIndex(index);
    // selectedCarParkBottomSheetRef.current?.snapToIndex(1);
  }, []);

  const expandBottomSheet = () => bottomSheetRef.current?.snapToIndex(2);
  const collapseBottomSheet = () => bottomSheetRef.current?.snapToIndex(1);
  // Handle search bar forcus/blur
  const handleFocus = () => setIsSearchFocused(true); // Set search bar focus to true, hide FlatList
  const handleBlur = () => setIsSearchFocused(false); // Set search bar focus to false, show FlatList

  const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
    console.log("handleAnimate", fromIndex, toIndex);

    // Prevent dragging below 10%
    if (toIndex === -1) {
      bottomSheetRef.current?.snapToIndex(1); // Snap back to 40% (or any other desired index)
      console.log("SNAPBACK");
    }

    if (toIndex <= 1) {
      searchBarRef.current?.clearInput();
    }
  }, []);

  // for car park bottomsheet
  const handleExitSearch = () => {
    resetToUserLocation();
    searchBarRef.current?.clearInput();
    collapseBottomSheet();
  };

  const fetchNearByCarParks = async () => {
    console.log("Fetching nearby car parks from /api/carpark/nearby/");
    try {
      // const resp = await axios.post(
      //   `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:${process.env.EXPO_PUBLIC_SERVER_PORT}/api/carpark/nearby/`,
      //   initialProcessedPayload,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

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

  useEffect(() => {
    console.log("Started fetching nearby car parks");
    fetchNearByCarParks();
  }, [
    initialProcessedPayload,
    searchedLocationPayload,
    isShowingSearchedLocation,
  ]);

  // Animation for the flatlist
  const flatListAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        bottomSheetPosition.value,
        [SCREEN_DIMENSIONS.height * 0.88, SCREEN_DIMENSIONS.height * 0.7],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      ),
    };
  });

  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track focus state of the search bar
  const [selectedCarPark, setSelectedCarPark] = useState<any | null>(null);

  const getStreetViewUrl = (latitude: number, longitude: number) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: "white" }]}
        onPress={() => {
          setSelectedCarPark(item);
          collapseBottomSheet();
          selectedCarParkBottomSheetRef.current?.snapToIndex(1);
        }}
      >
        {item.type === "CarPark" ? (
          <>
            <View style={styles.titleContainer}>
              <Ionicons
                name="car-outline"
                size={20}
                color="#333"
                style={styles.iconContainer}
              />
              <Text style={styles.carParkTitle}>{item.address || "N/A"}</Text>
            </View>
            <Text style={styles.itemDetail}>
              Type: {item.carParkType || "N/A"}
            </Text>
            <Text style={styles.itemDetail}>
              Lots Available:
              {item.lotDetails?.C?.availableLots !== undefined ? (
                <Text style={styles.availableLots}>
                  {item.lotDetails.C.availableLots}
                </Text>
              ) : (
                <Text style={styles.notAvailable}> N/A</Text>
              )}
              {item.lotDetails?.C?.totalLots && (
                <Text style={{ color: "#777" }}>
                  / {item.lotDetails.C.totalLots}
                </Text>
              )}
            </Text>
          </>
        ) : (
          <>
            <View style={styles.titleContainer}>
              <Ionicons
                name="flash-outline"
                size={20}
                color="#007bff"
                style={styles.iconContainer}
              />
              <Text style={styles.evStationTitle}>
                {item.displayName || "N/A"}
              </Text>
            </View>
            <Text style={styles.itemDetail}>
              Chargers: {item.totalChargers || "N/A"}
            </Text>
            <Text style={styles.itemDetail}>
              Operator: {item.operator || "Unknown"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    ),
    []
  );

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#F5F5F7" }}
        onAnimate={handleAnimate} // Use onAnimate to detect drag attempts
        enablePanDownToClose={false}
        animatedPosition={bottomSheetPosition}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.searchBarContainer}>
          <GoogleSearchBar
            ref={searchBarRef}
            onFocusExpand={expandBottomSheet}
            onCancelPress={collapseBottomSheet}
            onFoucs={handleFocus}
            onBlur={handleBlur}
            searchedLocation={handleSearchedLocation}
          />
        </BottomSheetView>

        <View style={styles.spacer} />

        {!isSearchFocused && (
          <BottomSheetFlatList
            data={combinedListCarPark}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            style={[styles.flatList, flatListAnimatedStyle]}
          ></BottomSheetFlatList>
        )}
      </BottomSheet>

      {/* New BottomSheet for Selected Car Park Details */}
      {selectedCarPark && (
        <BottomSheet
          ref={selectedCarParkBottomSheetRef} // Use a separate ref if needed
          index={1}
          snapPoints={["10%", "40%", "93%"]}
          onChange={handleSheetChanges_SelectedCarPark}
          backgroundStyle={{ backgroundColor: "#F5F5F7" }}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
        >
          <BottomSheetView style={styles.itemDetail}>
            {selectedCarPark.type === "CarPark" ? (
              <>
                {/* Display the Street View Image */}
                {selectedCarPark.latitude && selectedCarPark.longitude && (
                  <Image
                    style={styles.streetViewImage}
                    source={{
                      uri: getStreetViewUrl(
                        selectedCarPark.latitude,
                        selectedCarPark.longitude
                      ),
                    }}
                  />
                )}

                <Text style={styles.selectedCarParkDetails}>
                  Car Park ID: {selectedCarPark.carParkID}
                </Text>
                <Text style={styles.selectedCarParkDetails}>
                  Address: {selectedCarPark.address}
                </Text>
                <Text style={styles.selectedCarParkDetails}>
                  Type: {selectedCarPark.carParkType}
                </Text>
                <Text style={styles.selectedCarParkDetails}>
                  Available Lots: {selectedCarPark.lotDetails?.C?.availableLots}
                </Text>
              </>
            ) : selectedCarPark.type === "EV" ? (
              <>
                <Text style={styles.selectedCarParkDetailsTitle}>
                  EV Station Details
                </Text>
                <Text style={styles.selectedCarParkDetails}>
                  Display Name: {selectedCarPark.displayName}
                </Text>
                <Text style={styles.selectedCarParkDetails}>
                  Chargers: {selectedCarPark.totalChargers}
                </Text>
                <Text style={styles.selectedCarParkDetails}>
                  Operator: {selectedCarPark.operator}
                </Text>
              </>
            ) : null}

            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => console.log("Navigate pressed")}
            >
              <Text style={styles.navigateButtonText}>Navigate</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: "#CCCCCC",
    alignSelf: "center",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  spacer: {
    height: 40, // Adjust this value to control how much lower the FlatList appears
  },
  flatList: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "red", // Light background for each item
    padding: 15,
    marginBottom: 10,
    borderRadius: 8, // Slightly rounded corners
    borderWidth: 1,
    borderColor: "#e0e0e0", // Light border
  },
  carParkTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    color: "#333",
  },
  evStationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    color: "#007bff", // Blue color for EV Station
  },
  itemDetail: {
    fontSize: 15, // Slightly larger for better readability
    color: "#666", // Softer gray for a more subtle effect
    marginBottom: 6, // Increased bottom margin for better separation
    lineHeight: 22, // Improves readability by increasing vertical space
    letterSpacing: 0.5, // Adds a slight space between characters for better legibility
    fontFamily: "Arial", // Optional: Add a modern font if available
    textAlign: "left", // Ensure text is left-aligned (or 'center' if preferred)
  },
  streetViewImage: {
    width: "100%",
    height: 150, // Adjust as needed
    marginTop: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  availableLots: {
    fontWeight: "bold",
    color: "green", // Highlight available lots
  },
  notAvailable: {
    color: "#888", // Less prominent for "N/A"
    fontStyle: "italic",
  },
  iconContainer: {
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  selectedCarParkDetailsTitle: {
    fontFamily: "SourceCodePro-BlackIt",
    fontSize: 27,
    fontWeight: "bold",
    alignSelf: "center",
    color: "blue",
    marginBottom: 8,
    lineHeight: 40, // Line height for better readability
  },
  selectedCarParkDetails: {
    fontSize: 13,
    fontFamily: "ArialRoundedBold",
    color: "#FFFFF",
    marginBottom: 0,
    lineHeight: 20, // Line height for better readability
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    alignSelf: "center", // Center the box
    width: "90%", // Make it responsive with 80% width    borderColor: '#333',
    borderRadius: 5, // Optional: adds rounded corners to the box
  },
  navigateButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderRadius: 8,
    width: "80%",
    alignSelf: "center",
    marginTop: 25,
  },

  navigateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default BottomSheetContainer;
