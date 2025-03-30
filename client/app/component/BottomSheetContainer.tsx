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
  Platform,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";
import { UserLocationContext } from "../context/userLocation";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import AntDesign from "@expo/vector-icons/AntDesign";

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

  const snapPoints = useMemo(() => ["10%", "45%", "93%"], []);
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

  const selectedCarParkBottomSheetPosition = useSharedValue(0);

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

  // Handle exit search for a specific location
  const handleExitSearch = () => {
    resetToUserLocation();
    searchBarRef.current?.clearInput();
    collapseBottomSheet();
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

  const getCarParkIcon = (
    type:
      | "MULTI-STOREY CAR PARK"
      | "SURFACE CAR PARK"
      | "BASEMENT CAR PARK"
      | "SURFACE/MULTI-STOREY CAR PARK"
      | string
  ) => {
    switch (type) {
      case "MULTI-STOREY CAR PARK":
        return "business-outline"; // Sheltered, so use a building icon
      case "SURFACE CAR PARK":
        return "car-outline"; // Unsheltered, so use a car icon
      case "BASEMENT CAR PARK":
        return "download-outline"; // Basement, so use a downward arrow
      case "SURFACE/MULTI-STOREY CAR PARK":
        return "business-outline";
      default:
        return "help-circle-outline"; // Default for unknown types
    }
  };
  const getCarParkTypeLabel = (
    type:
      | "MULTI-STOREY CAR PARK"
      | "SURFACE CAR PARK"
      | "BASEMENT CAR PARK"
      | string
  ) => {
    switch (type) {
      case "MULTI-STOREY CAR PARK":
        return "Sheltered";
      case "SURFACE CAR PARK":
        return "Unsheltered";
      case "BASEMENT CAR PARK":
        return "Basement";
      default:
        return "N/A";
    }
  };

  useAnimatedReaction(
    () => selectedCarParkBottomSheetPosition.value,
    (currentPosition) => {
      bottomSheetPosition.value = currentPosition; // Sync outer with inner
    }
  );

  const [showSelectedCarParkSheet, setShowSelectedCarParkSheet] =
    useState(false);

  // Handle closing the car park detail sheet
  const handleCloseCarParkSheet = () => {
    setShowSelectedCarParkSheet(false);
    setSelectedCarPark(null);
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: "white" }]}
        onPress={() => {
          setSelectedCarPark(item);
          setShowSelectedCarParkSheet(true); // Show the car park detail sheet
        }}
      >
        {item.type === "CarPark" ? (
          <>
            <View style={[styles.titleContainer]}>
              {/* Ensure column layout */}
              <Image
                style={styles.streetViewImageList}
                source={{
                  uri: getStreetViewUrl(item.latitude, item.longitude),
                }}
              />
              <View style={{ flexDirection: "column" }}>
                {/* Apply column layout only to title and details */}
                <Text style={styles.carParkTitle}>{item.address || "N/A"}</Text>
                <Text style={styles.moreDetailsText}>
                  Press more for details
                </Text>
              </View>
            </View>
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
      {!showSelectedCarParkSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: "white" }}
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
      )}

      {/* New BottomSheet for Selected Car Park Details */}
      {selectedCarPark && showSelectedCarParkSheet && (
        <BottomSheet
          ref={selectedCarParkBottomSheetRef} // Use a separate ref if needed
          index={1}
          snapPoints={["13%", "45%"]}
          onChange={handleSheetChanges_SelectedCarPark}
          backgroundStyle={{ backgroundColor: "#F5F5F7" }}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          animatedPosition={selectedCarParkBottomSheetPosition}
        >
          <BottomSheetView style={styles.itemDetail}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseCarParkSheet}
            >
              <AntDesign name="closecircle" size={16} color="grey" />
            </TouchableOpacity>
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
                  Type: {getCarParkTypeLabel(selectedCarPark.carParkType)}{" "}
                  {/* <Ionicons
                    name={getCarParkIcon(selectedCarPark.carParkType)}
                    size={16}
                    color="black" // Customize color
                  /> */}
                </Text>
                <Text style={styles.selectedCarParkDetails}>
                  Lots Available:{" "}
                  {selectedCarPark.lotDetails?.C?.availableLots !==
                  undefined ? (
                    <Text
                      style={[
                        styles.availableLots,
                        {
                          color:
                            selectedCarPark.lotDetails.C.availableLots < 20
                              ? "red"
                              : selectedCarPark.lotDetails.C.availableLots < 100
                              ? "orange"
                              : "green", // Default to green if 50 or more
                        },
                      ]}
                    >
                      {selectedCarPark.lotDetails.C.availableLots}
                    </Text>
                  ) : (
                    <Text style={styles.notAvailable}> N/A</Text>
                  )}
                  {selectedCarPark.lotDetails?.C?.totalLots && (
                    <Text style={{ color: "#777" }}>
                      {" "}
                      / {selectedCarPark.lotDetails.C.totalLots}
                    </Text>
                  )}
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
    backgroundColor: "#FFFFF",
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
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0", // Light separator lines
    backgroundColor: "transparent", // No box effect
    flexDirection: "column",
  },
  carParkTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    marginLeft: 8,
    color: "#333",
  },
  moreDetailsText: {
    fontSize: 14,
    color: "#007bff", // You can adjust the color as needed
    marginTop: 5, // Optional, for spacing
    marginLeft: 10,
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
    lineHeight: 20, // Improves readability by increasing vertical space
    letterSpacing: 0.5, // Adds a slight space between characters for better legibility
    fontFamily: "Arial", // Optional: Add a modern font if available
    textAlign: "left", // Ensure text is left-aligned (or 'center' if preferred)
  },
  streetViewImage: {
    width: Platform.OS === "ios" ? "100%" : SCREEN_DIMENSIONS.width * 0.9,
    height: 150, // Adjust as needed
    marginTop: 30,
    borderRadius: 15,
    paddingHorizontal: 20,
    alignContent: "center",
    alignSelf: "center",
  },
  streetViewImageList: {
    width: 60,
    height: 60, // Adjust as needed
    marginTop: 10,
    borderRadius: 15,
    paddingHorizontal: 0,
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
    marginBottom: 5,
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
    fontSize: 14,
    fontFamily: "ArialRoundedBold",
    color: "#FFFFF",
    lineHeight: 25, // Line height for better readability
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    alignSelf: "center", // Center the box
    width: "90%", // Make it responsive with 80% width    borderColor: '#333',
    top: SCREEN_DIMENSIONS.height * 0.01,
  },
  navigateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 13,
    borderRadius: 12,
    width: SCREEN_DIMENSIONS.width * 0.9,
    alignSelf: "center",
    top: SCREEN_DIMENSIONS.height * 0.023,
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    bottom:
      Platform.OS === "ios"
        ? SCREEN_DIMENSIONS.height * 0.33
        : SCREEN_DIMENSIONS.height * 0.35,
    right: SCREEN_DIMENSIONS.width * 0.05,
    zIndex: 10,
  },
});

export default BottomSheetContainer;
// import React, { useCallback, useContext, useState, useRef } from "react";
// import { StyleSheet, Keyboard, View } from "react-native";
// import BottomSheet from "@gorhom/bottom-sheet";
// import { SharedValue } from "react-native-reanimated";
// import GoogleSearchBar from "./SearchBar";
// import { UserLocationContext } from "../context/userLocation";
// import CarParkList from "./CarParkList";
// import CarParkBottomSheet from "./CarParkBottomSheet";
// import useCarParkData from "./hooks/useCarParkData";
// import useBottomSheetAnimation from "./hooks/useBottomSheetAnimation";

// const BottomSheetContainer = ({
//   bottomSheetPosition,
//   searchedLocation: setSearchedLocationFromMap,
// }: {
//   bottomSheetPosition: SharedValue<number>;
//   searchedLocation: (location: any) => void;
// }) => {
//   // Refs
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const searchBarRef = useRef<{ clearInput: () => void }>(null);

//   // State
//   const [currentIndex, setCurrentIndex] = useState(1);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [selectedCarPark, setSelectedCarPark] = useState<any | null>(null);
//   const [showSelectedCarParkSheet, setShowSelectedCarParkSheet] =
//     useState(false);

//   // Context
//   const { resetToUserLocation } = useContext(UserLocationContext);

//   // Custom hooks
//   const { snapPoints, handleAnimate } = useBottomSheetAnimation();
//   const {
//     combinedListCarPark,
//     searchedLocation,
//     setSearchedLocation,
//     handleSearchedLocation,
//   } = useCarParkData(setSearchedLocationFromMap);

//   // Handlers
//   const handleSheetChanges = useCallback((index: number) => {
//     setCurrentIndex(index);
//     if (index < 2) {
//       Keyboard.dismiss();
//     }
//   }, []);

//   const expandBottomSheet = () => bottomSheetRef.current?.snapToIndex(2);
//   const collapseBottomSheet = () => bottomSheetRef.current?.snapToIndex(1);

//   const handleFocus = () => setIsSearchFocused(true);
//   const handleBlur = () => setIsSearchFocused(false);

//   const handleExitSearch = () => {
//     resetToUserLocation();
//     searchBarRef.current?.clearInput();
//     collapseBottomSheet();
//   };

//   const handleSelectCarPark = (carPark: any) => {
//     setSelectedCarPark(carPark);
//     setShowSelectedCarParkSheet(true);
//   };

//   const handleCloseCarParkSheet = () => {
//     setShowSelectedCarParkSheet(false);
//     setSelectedCarPark(null);
//   };

//   return (
//     <>
//       {!showSelectedCarParkSheet && (
//         <BottomSheet
//           ref={bottomSheetRef}
//           index={1}
//           snapPoints={snapPoints}
//           onChange={handleSheetChanges}
//           backgroundStyle={{ backgroundColor: "white" }}
//           onAnimate={handleAnimate}
//           enablePanDownToClose={false}
//           animatedPosition={bottomSheetPosition}
//           enableDynamicSizing={false}
//         >
//           <View style={styles.searchBarContainer}>
//             <GoogleSearchBar
//               ref={searchBarRef}
//               onFocusExpand={expandBottomSheet}
//               onCancelPress={collapseBottomSheet}
//               onFoucs={handleFocus}
//               onBlur={handleBlur}
//               searchedLocation={handleSearchedLocation}
//             />
//           </View>

//           <View style={styles.spacer} />

//           {!isSearchFocused && (
//             <CarParkList
//               data={combinedListCarPark}
//               bottomSheetPosition={bottomSheetPosition}
//               onSelectCarPark={handleSelectCarPark}
//             />
//           )}
//         </BottomSheet>
//       )}

//       {selectedCarPark && showSelectedCarParkSheet && (
//         <CarParkBottomSheet
//           selectedCarPark={selectedCarPark}
//           onClose={handleCloseCarParkSheet}
//           bottomSheetPosition={bottomSheetPosition}
//         />
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   searchBarContainer: {
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   spacer: {
//     height: 40,
//   },
// });

// export default BottomSheetContainer;
