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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const deviceHeight = Dimensions.get("window").height;

const BottomSheetContainer = ({
  bottomSheetPosition,
}: {
  bottomSheetPosition: SharedValue<number>;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
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

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          // Set the selected car park
          setSelectedCarPark(item);
        }}
      >
        {" "}
        {item.type === "CarPark" ? (
          <>
            <View style={styles.titleContainer}>
              <Ionicons
                name="car-outline"
                size={20}
                color="#333"
                style={styles.iconContainer}
              />
              <Text style={styles.carParkTitle}>
                Car Park: {item.carParkID}
              </Text>
            </View>
            <Text style={styles.itemDetail}>Address: {item.address}</Text>
            <Text style={styles.itemDetail}>Type: {item.carParkType}</Text>
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
                  {" "}
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
                EV Station: {item.displayName}
              </Text>
            </View>
            <Text style={styles.itemDetail}>
              Chargers: {item.totalChargers}
            </Text>
            <Text style={styles.itemDetail}>Operator: {item.operator}</Text>
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
          // ref={bottomSheetRef} // Use a separate ref if needed
          index={2}
          snapPoints={["40%"]} // Adjust based on your need
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: "#F5F5F7" }}
        >
          <BottomSheetView style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Car Park Details</Text>
            <Text style={styles.itemDetail}>
              Car Park ID: {selectedCarPark.carParkID}
            </Text>
            <Text style={styles.itemDetail}>
              Address: {selectedCarPark.address}
            </Text>
            <Text style={styles.itemDetail}>
              Type: {selectedCarPark.carParkType}
            </Text>
            <Text style={styles.itemDetail}>
              Available Lots: {selectedCarPark.lotDetails?.C?.availableLots}
            </Text>
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
    backgroundColor: "#f8f8f8", // Light background for each item
    padding: 15,
    marginBottom: 10,
    borderRadius: 8, // Slightly rounded corners
    borderWidth: 1,
    borderColor: "#e0e0e0", // Light border
  },
  carParkTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  evStationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#007bff", // Blue color for EV Station
  },
  itemDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
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
});

export default BottomSheetContainer;
