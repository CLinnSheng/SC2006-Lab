import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Dimensions, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";

const { width } = Dimensions.get("window");

const BottomSheetContainer = ({
  mapRef,
  bottomSheetPosition,
}: {
  mapRef: React.RefObject<any>;
  bottomSheetPosition: SharedValue<number>;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "40%", "93%"], []); // Added snap point for index 0 (fully collapsed)
  
  // State to track visibility of the search bar
  const [isSearchVisible, setSearchVisible] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const expandBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(2); // Expands the sheet
    }
  };

  const snapBottomSheetToIndex0 = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1); // Snap the bottom sheet to index 0 (fully collapsed)
    }
  };

  // Toggle the search bar visibility and snap the bottom sheet to index 0 when hidden
  const toggleSearchBar = () => {
    setSearchVisible((prevState) => {
      const newState = !prevState;
      if (!newState) {
        snapBottomSheetToIndex0(); // Snap to index 0 when the search bar is hidden
      }
      return newState;
    });
    if (!isSearchVisible) {
      expandBottomSheet(); // Expand the bottom sheet when search bar is shown
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1} // Initial index set to 1 (partially expanded)
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={{ backgroundColor: "#F5F5F7" }}
      enablePanDownToClose={false}
      enableOverDrag={false}
      animatedPosition={bottomSheetPosition}
    >
      <BottomSheetView>
        {/* Button to toggle the search bar, positioned at the top-right corner */}
        <View style={styles.searchButtonContainer}>
          <TouchableOpacity onPress={toggleSearchBar} style={styles.button}>
            <Text style={styles.buttonText}>{isSearchVisible ? "🔙" : "🔍"}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Only render the search bar when it is visible */}
        {isSearchVisible && (
          <GoogleSearchBar
            onFocusExpand={expandBottomSheet}
            onCancelPress={snapBottomSheetToIndex0} // Snap to index 0 on cancel
          />
        )}
      </BottomSheetView>
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
  // Container for the search button positioned at the top-right corner
  searchButtonContainer: {
    position: "absolute",
    top: 2,
    right: 10,
    zIndex: 1, // Ensure the button is on top of other content
  },
  // Custom button style using TouchableOpacity
  button: {
    backgroundColor: "#BBBB", // Grey background for the button
    borderRadius: 20, // Rounded corners for the button
    paddingHorizontal: 10, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    alignItems: "center", // Center the text inside the button
    justifyContent: "center",
  },
  // Text inside the button
  buttonText: {
    color: "#000000", // Black text color
    fontSize: 16, // Text size
  },
});

export default BottomSheetContainer;
