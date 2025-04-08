import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import filterUtils from "../utils/filterUtils";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
interface FilterDropdownProps {
  selectedFilter: string;
  selectedSort: string;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  bottomSheetPosition: Animated.SharedValue<number>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  selectedFilter,
  selectedSort,
  onFilterChange,
  onSortChange,
  bottomSheetPosition,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const FilterAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        bottomSheetPosition.value,
        [SCREEN_DIMENSIONS.height * 0.88, SCREEN_DIMENSIONS.height * 0.7],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      ),
    };
  });
  return (
    <Animated.View style={[styles.filterContainer, FilterAnimatedStyle]}>
      {/* Combined Filter/Sort Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={styles.filterButtonText}>
          {selectedFilter} · Sort: {selectedSort}
        </Text>
        <MaterialIcons
          name={showOptions ? "arrow-drop-up" : "arrow-drop-down"}
          size={24}
          color="#555"
        />
      </TouchableOpacity>

      {/* Combined Options */}
      {showOptions && (
        <View style={styles.optionsContainer}>
          {/* Filter section header */}
          <Text style={styles.optionSectionHeader}>Filter by Type</Text>
          <View style={styles.optionDivider} />

          {/* Filter options */}
          {Object.values(filterUtils.FILTER_TYPES).map((type) => (
            <TouchableOpacity
              key={`filter-${type}`}
              style={[
                styles.optionItem,
                selectedFilter === type && styles.selectedOption,
              ]}
              onPress={() => {
                onFilterChange(type);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedFilter === type && styles.selectedOptionText,
                ]}
              >
                {String(type)}
              </Text>
              {selectedFilter === type && (
                <MaterialIcons name="check" size={18} color="#0288d1" />
              )}
            </TouchableOpacity>
          ))}

          {/* Sort section header */}
          <Text style={[styles.optionSectionHeader, { marginTop: 10 }]}>
            Sort by
          </Text>
          <View style={styles.optionDivider} />

          {/* Sort options */}
          {Object.values(filterUtils.SORT_BY).map((sort) => (
            <TouchableOpacity
              key={`sort-${sort}`}
              style={[
                styles.optionItem,
                selectedSort === sort && styles.selectedOption,
              ]}
              onPress={() => {
                onSortChange(sort);
                // Keep dropdown open to allow filter selection
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSort === sort && styles.selectedOptionText,
                ]}
              >
                {String(sort)}
              </Text>
              {selectedSort === sort && (
                <MaterialIcons name="check" size={18} color="#0288d1" />
              )}
            </TouchableOpacity>
          ))}

          {/* Done button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setShowOptions(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    position: "relative",
    top: 30,
    width: "45%",
    alignSelf: "flex-end",
    right: 5,
    zIndex: 100,
  },
  filterButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  optionsContainer: {
    position: "absolute",
    top: 45,
    right: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 100,
    width: "100%",
  },
  optionSectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 2,
    paddingHorizontal: 8,
  },
  optionDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#e1f5fe",
  },
  optionText: {
    fontSize: 14,
    color: "#555",
  },
  selectedOptionText: {
    color: "#0288d1",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: "#0288d1",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default FilterDropdown;
