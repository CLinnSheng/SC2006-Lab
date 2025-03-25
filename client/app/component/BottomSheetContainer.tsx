import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Keyboard, Text, View, Animated } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { SharedValue } from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";
import { UserLocationContext } from "../context/userLocation";
import axios from "axios";

const BottomSheetContainer = ({
  bottomSheetPosition,
  placelist,
}: {
  bottomSheetPosition: SharedValue<number>;
  placelist: any[];
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const searchBarRef = useRef<{ clearInput: () => void }>(null);

  const snapPoints = useMemo(() => ["12%", "40%", "93%"], []);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [carPark, setCarPark] = useState<any[]>([]);

  const { initialProcessedPayload } = useContext(UserLocationContext);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    setCurrentIndex(index);
    if (index <= 2) {
      Keyboard.dismiss();
    }
  }, []);

  const expandBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(2);
    }
  };

  const collapseBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
  };

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

  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const fetchNearByCarParks = async () => {
    setLoading(true);
    try {
      const resp = await axios.post(
        "http://192.168.0.102:8000/api/carpark/nearby/",
        initialProcessedPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("TESTING");
      console.log(resp.data);
      setCarPark(resp.data.CarPark);
    } catch (error) {
      console.error("API call error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialProcessedPayload) {
      fetchNearByCarParks();
    } else {
      console.log("Initial Processed Payload not set");
    }
  }, [initialProcessedPayload]);

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
        />
      </BottomSheetView>

      <View style={styles.spacer} />

      <View style={{ flex: 1 }}>
        <BottomSheetFlatList
          // data={placelist}
          data={carPark}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        ></BottomSheetFlatList>
      </View>
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
    height: 80, // Adjust this value to control how much lower the FlatList appears
  },
});

export default BottomSheetContainer;
