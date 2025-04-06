import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SharedValue, useSharedValue, useAnimatedReaction } from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import SCREEN_DIMENSIONS from "../constants/screenDimension";

interface FilterBottomSheetProps {
  onClose: () => void;
  bottomSheetPosition: SharedValue<number>;
}

const FilterBottomSheet = ({
  onClose,
  bottomSheetPosition,
}: FilterBottomSheetProps) => {
  const filterBottomSheetRef = useRef<BottomSheet>(null);
  const filterBottomSheetPosition = useSharedValue(0);

  // Sync the filter bottom sheet position with the parent bottom sheet position
  useAnimatedReaction(
    () => filterBottomSheetPosition.value,
    (currentPosition) => {
      bottomSheetPosition.value = currentPosition;
    }
  );

  return (
    <BottomSheet
      ref={filterBottomSheetRef}
      index={1}
      snapPoints={["25%", "50%"]}
      backgroundStyle={{ backgroundColor: "#F5F5F7" }}
      enablePanDownToClose={true}
      onClose={onClose}
      animatedPosition={filterBottomSheetPosition}
    >
      <BottomSheetView style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="closecircle" size={16} color="grey" />
        </TouchableOpacity>

        <Text style={styles.title}>Filter Options</Text>
        <View style={styles.optionsContainer}>
          <Text style={styles.option}>Price Range</Text>
          <Text style={styles.option}>Distance</Text>
          <Text style={styles.option}>Availability</Text>
        </View>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            console.log("Apply filters pressed");
            onClose();
          }}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
    fontSize: 16,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 13,
    borderRadius: 12,
    width: SCREEN_DIMENSIONS.width * 0.9,
    alignSelf: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default FilterBottomSheet;