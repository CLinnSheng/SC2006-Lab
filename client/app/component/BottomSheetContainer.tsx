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
  Animated,
  Dimensions,
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
import * as Font from "expo-font";

const loadFonts = () => {
  return Font.loadAsync({
    "DejaVuSansMono-BoldOblique": require("../../assets/fonts/DejaVuSansMono-BoldOblique.ttf"),
    ArialRoundedBold: require("../../assets/fonts/SourceCodePro-BlackIt.ttf"), // Make sure the path is correct
  });
};

const deviceHeight = Dimensions.get("window").height;

const BottomSheetContainer = ({
  bottomSheetPosition,
}: {
  bottomSheetPosition: SharedValue<number>;
}) => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setIsFontLoaded(true));
  }, []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const selectedCarParkBottomSheetRef = useRef<BottomSheet>(null);

  const searchBarRef = useRef<{ clearInput: () => void }>(null);

  const snapPoints = useMemo(() => ["10%", "40%", "93%"], []);
  const [currentIndex, setCurrentIndex] = useState(1);

  const { initialProcessedPayload } = useContext(UserLocationContext);

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
    setSearchedLocation(location);
    console.log("Searched location:", location);
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    setCurrentIndex(index);
    if (index < 2) {
      Keyboard.dismiss();
    }
  }, []);

  const expandBottomSheet = () => bottomSheetRef.current?.snapToIndex(2);
  const collapseBottomSheet = () => bottomSheetRef.current?.snapToIndex(1);

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

  const fetchNearByCarParks = async () => {
    console.log("Fetching nearby car parks from /api/carpark/nearby/");
    try {
      const resp = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:${process.env.EXPO_PUBLIC_SERVER_PORT}/api/carpark/nearby/`,
        initialProcessedPayload,
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
    if (initialProcessedPayload) {
      fetchNearByCarParks();
    } else {
      console.log("Initial Processed Payload not set");
    }
  }, [initialProcessedPayload]);

  // Animation for the flatlist
  const flatListAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        bottomSheetPosition.value,
        [deviceHeight * 0.88, deviceHeight * 0.7],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      ),
    };
  });

  const [isSearchFocused, setIsSearchFocused] = useState(false); // Track focus state of the search bar

  // Handle search bar forcus/blur
  const handleFocus = () => setIsSearchFocused(true); // Set search bar focus to true, hide FlatList
  const handleBlur = () => setIsSearchFocused(false); // Set search bar focus to false, show FlatList

  const [selectedCarPark, setSelectedCarPark] = useState<any | null>(null);
  const getStreetViewUrl = (latitude: number, longitude: number) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;
  };
  const getCarParkIcon = (type: "MULTI-STOREY CAR PARK" | "SURFACE CAR PARK" | "BASEMENT CAR PARK" | "SURFACE/MULTI-STOREY CAR PARK" | string) => {
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
  const getCarParkTypeLabel = (type: "MULTI-STOREY CAR PARK" | "SURFACE CAR PARK" | "BASEMENT CAR PARK" | string) => {
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

  

  

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: "white" }]}        
      onPress={() => {
          setSelectedCarPark(item);
          if (selectedCarParkBottomSheetRef.current) {
            selectedCarParkBottomSheetRef.current.snapToIndex(0);
          }
        }}
      >
        {item.type === "CarPark" ? (
          <>
            <View style={[styles.titleContainer]}> {/* Ensure column layout */}
              <Image
                style={styles.streetViewImageList}
                source={{
                  uri: getStreetViewUrl(item.latitude, item.longitude),
                }}
              />
              <View style={{ flexDirection: 'column' }}> {/* Apply column layout only to title and details */}
                <Text style={styles.carParkTitle}>{item.address || "N/A"}</Text>
                <Text style={styles.moreDetailsText}>Press more for details</Text> {/* Added this line */}
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
              {"Chargers: " + (item.totalChargers || "N/A")}
            </Text>
            <Text style={styles.itemDetail}>
              {"Operator: " + (item.operator || "Unknown")}
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

      {/* New BottomSheet for Selected Car Park Details */}
      {selectedCarPark && (
        <BottomSheet
          ref={selectedCarParkBottomSheetRef} // Use a separate ref if needed
          index={0}
          snapPoints={["50%"]}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: "#F5F5F7" }}
          enablePanDownToClose={true} // Allow swiping down to close the bottom sheet
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
      Type: {getCarParkTypeLabel(selectedCarPark.carParkType)}{" "}
      <Ionicons
      name={getCarParkIcon(selectedCarPark.carParkType)}
      size={16}
      color="black" // Customize color
    />
    </Text>
    <Text style={styles.selectedCarParkDetails}>
              Lots Available:
              {selectedCarPark.lotDetails?.C?.availableLots !== undefined ? (
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
  flexDirection: 'column',
  },
  carParkTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    marginLeft:8,
    color: "#333",
  },
  
    moreDetailsText: {
      fontSize: 14,
      color: "#007bff",  // You can adjust the color as needed
      marginTop: 5,      // Optional, for spacing
      marginLeft:10,
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
