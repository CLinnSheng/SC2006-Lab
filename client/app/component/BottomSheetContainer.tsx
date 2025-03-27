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

const deviceHeight = Dimensions.get("window").height;

const BottomSheetContainer = ({
  bottomSheetPosition,
  placelist,
}: {
  bottomSheetPosition: SharedValue<number>;
  placelist: any[];
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const searchBarRef = useRef<{ clearInput: () => void }>(null);

  const snapPoints = useMemo(() => ["10%", "40%", "93%"], []);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [carPark, setCarPark] = useState<any[]>([]);

  const { initialProcessedPayload } = useContext(UserLocationContext);

  const [searchedLocation, setSearchedLocation] = useState<any>(null);
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

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.itemContainer}>
        {/* <Text>{item.displayName.text}</Text> */}
        <Text>{item.address}</Text>
      </View>
    ),
    []
  );

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
      setCarPark(resp.data.CarPark); // Assuming the choosing the carpark
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

  return (
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
          data={carPark}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          style={[styles.flatList, flatListAnimatedStyle]}
        ></BottomSheetFlatList>
      )}
    </BottomSheet>
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
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "transparent",
    borderRadius: 8,
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
});

export default BottomSheetContainer;
