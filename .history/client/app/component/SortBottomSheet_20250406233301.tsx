import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SharedValue, useSharedValue, useAnimatedReaction } from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";

export type SortOption = 'distance' | 'availability' | 'price';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  sortBy: SortOption;
  direction: SortDirection;
}

interface SortBottomSheetProps {
  onClose: () => void;
  bottomSheetPosition: SharedValue<number>;
  onApplySort: (options: SortOptions) => void;
  currentSort: SortOptions;
}

const SortBottomSheet = ({
  onClose,
  bottomSheetPosition,
  onApplySort,
  currentSort,
}: SortBottomSheetProps) => {
  const sortBottomSheetRef = useRef<BottomSheet>(null);
  const sortBottomSheetPosition = useSharedValue(0);

  // Local state for sort values
  const [sortBy, setSortBy] = useState<SortOption>(currentSort.sortBy);
  const [direction, setDirection] = useState<SortDirection>(currentSort.direction);

  // Sync the sort bottom sheet position with the parent bottom sheet position
  useAnimatedReaction(
    () => sortBottomSheetPosition.value,
    (currentPosition) => {
      bottomSheetPosition.value = currentPosition;
    }
  );

  const applySort = () => {
    onApplySort({
      sortBy,
      direction,
    });
  };

  const renderSortOption = (option: SortOption, label: string) => (
    <TouchableOpacity 
      style={[
        styles.sortOption,
        sortBy === option ? styles.sortOptionSelected : {}
      ]}
      onPress={() => setSortBy(option)}
    >
      <Text 
        style={[
          styles.sortOptionText, 
          sortBy === option ? styles.sortOptionTextSelected : {}
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderDirectionOption = (value: SortDirection, label: string) => (
    <TouchableOpacity 
      style={[
        styles.directionOption,
        direction === value ? styles.directionOptionSelected : {}
      ]}
      onPress={() => setDirection(value)}
    >
      <Text 
        style={[
          styles.directionOptionText, 
          direction === value ? styles.directionOptionTextSelected : {}
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={sortBottomSheetRef}
      index={1}
      snapPoints={["25%", "50%"]}
      backgroundStyle={{ backgroundColor: "#F5F5F7" }}
      enablePanDownToClose={true}
      onClose={onClose}
      animatedPosition={sortBottomSheetPosition}
    >
      <BottomSheetView style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="closecircle" size={16} color="grey" />
        </TouchableOpacity>

        <Text style={styles.title}>Sort Parking Locations</Text>
        
        {/* Sort By Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.optionsContainer}>
            {renderSortOption('distance', 'Distance')}
            {renderSortOption('availability', 'Availability')}
            {renderSortOption('price', 'Price')}
          </View>
        </View>

        {/* Direction Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order</Text>
          <View style={styles.optionsContainer}>
            {renderDirectionOption('asc', 'Ascending')}
            {renderDirectionOption('desc', 'Descending')}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={applySort}
          >
            <Text style={styles.applyButtonText}>Apply Sorting</Text>
          </TouchableOpacity>
        </View>
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
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  sortOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    marginRight: 10,
    minWidth: '30%',
    alignItems: 'center',
  },
  sortOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  sortOptionTextSelected: {
    color: '#FFFFFF',
  },
  directionOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    minWidth: '45%',
    alignItems: 'center',
  },
  directionOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  directionOptionText: {
    fontSize: 14,
    color: '#333',
  },
  directionOptionTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 13,
    borderRadius: 12,
    width: '100%',
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default SortBottomSheet;