import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SharedValue } from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";

const BottomSheetContainer = ({
  mapRef,
  bottomSheetPosition,
}: {
  mapRef: React.RefObject<any>;
  bottomSheetPosition: SharedValue<number>;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "40%", "93%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const expandBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(3);
    }
  };

  const collapseBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(2);
    }
  };

  const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
    console.log("handleAnimate", fromIndex, toIndex);

    // Prevent dragging below 10%
    if (toIndex === 0) {
      // If the user tries to drag below 10%, stop the drag and keep the sheet at the current position
      bottomSheetRef.current?.snapToIndex(1); // Snap back to 40% (or any other desired index)
      console.log("SNAPBACK");
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={{ backgroundColor: "#F5F5F7" }}
      enablePanDownToClose={false}
      enableOverDrag={false}
      animatedPosition={bottomSheetPosition}
      onAnimate={handleAnimate} // Use onAnimate to detect drag attempts
    >
      <BottomSheetView>
        <GoogleSearchBar
          onFocusExpand={expandBottomSheet}
          onCancelPress={collapseBottomSheet}
        />
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
});

export default BottomSheetContainer;
