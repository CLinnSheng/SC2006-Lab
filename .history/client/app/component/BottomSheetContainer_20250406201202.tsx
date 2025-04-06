import React, { useCallback, useContext, useState, useRef } from "react";
import { StyleSheet, Keyboard, View, Text } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { SharedValue } from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";
import { UserLocationContext } from "../context/userLocation";
import CarParkList from "./CarParkList";
import CarParkBottomSheet from "./CarParkBottomSheet";
import FilterBottomSheet, { FilterOptions } from "./FilterBottomSheet";
import useCarParkData from "./hooks/useCarParkData";
import useBottomSheetAnimation from "./hooks/useBottomSheetAnimation";
import { useCarParkFilters } from "./hooks/useCarParkFilters";
import Filter from "./Filter";
import { decode } from "@googlemaps/polyline-codec";

const DEFAULT_FILTERS: FilterOptions = {
  distance: 1,
  vehicleType: "Car",
  evChargingAvailable: false,
  sheltered: null,
};

const BottomSheetContainer = ({
  bottomSheetPosition,
  searchedLocation: setSearchedLocationFromMap,
  onSelectCarPark,
}: {
  bottomSheetPosition: SharedValue<number>;
  searchedLocation: (location: any) => void;
  onSelectCarPark: (carPark: any) => void;
}) => {
  // Refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const searchBarRef = useRef<{ clearInput: () => void }>(null);

  // State
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCarPark, setSelectedCarPark] = useState<any | null>(null);
  const [showSelectedCarParkSheet, setShowSelectedCarParkSheet] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [filterWarning, setFilterWarning] = useState<string | null>(null);

  // Context
  const { resetToUserLocation } = useContext(UserLocationContext);

  // Custom hooks
  const { snapPoints, handleAnimate } = useBottomSheetAnimation();
  const {
    combinedListCarPark,
    searchedLocation,
    setSearchedLocation,
    handleSearchedLocation,
  } = useCarParkData(setSearchedLocationFromMap);

  const wouldHaveResults = useCallback((filtersToCheck: FilterOptions) => {
    return combinedListCarPark.some((carPark) => {
      if (carPark.routeInfo && carPark.routeInfo.distance) {
        const carParkDistance = parseFloat(carPark.routeInfo.distance);
        if (carParkDistance > filtersToCheck.distance) {
          return false;
        }
      }

      if (filtersToCheck.vehicleType) {
        if (filtersToCheck.vehicleType === "Car" && carPark.type === "CarPark") {
          if (!carPark.lotDetails?.C) {
            return false;
          }
        } else if (
          filtersToCheck.vehicleType === "Motorcycle" &&
          carPark.type === "CarPark"
        ) {
          if (!carPark.lotDetails?.M && !carPark.lotDetails?.Y) {
            return false;
          }
        } else if (
          filtersToCheck.vehicleType === "Heavy Vehicle" &&
          carPark.type === "CarPark"
        ) {
          if (!carPark.lotDetails?.H) {
            return false;
          }
        }
      }

      if (filtersToCheck.evChargingAvailable) {
        if (carPark.type !== "EV") {
          return false;
        }
      }

      if (filtersToCheck.sheltered !== null && carPark.type === "CarPark") {
        const isSheltered =
          carPark.carParkType === "MULTI-STOREY CAR PARK" ||
          carPark.carParkType === "BASEMENT CAR PARK";

        if (filtersToCheck.sheltered !== isSheltered) {
          return false;
        }
      }

      return true;
    });
  }, [combinedListCarPark]);

  const filteredCarParks = useCarParkFilters(combinedListCarPark, filters);
  const noMatchingCarParks =
    hasAppliedFilters && filteredCarParks.length === 0 && combinedListCarPark.length > 0;

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
    if (index < 2) {
      Keyboard.dismiss();
    }
  }, []);

  const expandBottomSheet = () => bottomSheetRef.current?.snapToIndex(2);
  const collapseBottomSheet = () => bottomSheetRef.current?.snapToIndex(1);

  const handleFocus = () => setIsSearchFocused(true);
  const handleBlur = () => setIsSearchFocused(false);

  const handleExitSearch = () => {
    resetToUserLocation();
    searchBarRef.current?.clearInput();
    collapseBottomSheet();
  };

  const handleSelectCarPark = (carPark: any) => {
    setSelectedCarPark(carPark);
    setShowSelectedCarParkSheet(true);
    console.log(decode(carPark.routeInfo.polyline));
    onSelectCarPark(carPark);
  };

  const handleCloseCarParkSheet = () => {
    setShowSelectedCarParkSheet(false);
    setSelectedCarPark(null);
    onSelectCarPark(null);
  };

  const handleFilterButtonPress = () => {
    console.log("Opening filter bottom sheet");
    setFilterWarning(null);
    setShowFilterSheet(true);
  };

  const handleFilterClose = () => {
    console.log("Closing filter bottom sheet");
    setFilterWarning(null);
    setShowFilterSheet(false);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    console.log("Applied filters:", newFilters);

    if (!wouldHaveResults(newFilters)) {
      setFilterWarning(
        "No parking locations match these filters. Please adjust your criteria."
      );
      return;
    }

    setFilterWarning(null);
    setFilters(newFilters);
    setHasAppliedFilters(true);
    setShowFilterSheet(false);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setHasAppliedFilters(false);
    setFilterWarning(null);
  };

  return (
    <>
      {!showSelectedCarParkSheet && !showFilterSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: "white" }}
          onAnimate={handleAnimate}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          animatedPosition={bottomSheetPosition}
        >
          <View style={styles.searchBarContainer}>
            <GoogleSearchBar
              ref={searchBarRef}
              onFocusExpand={expandBottomSheet}
              onCancelPress={collapseBottomSheet}
              onFoucs={handleFocus}
              onBlur={handleBlur}
              searchedLocation={handleSearchedLocation}
              onExitSearch={handleExitSearch}
            />
          </View>

          <View style={styles.spacer} />

          {!isSearchFocused && combinedListCarPark.length > 0 && (
            <View style={styles.filterButtonContainer}>
              <Filter onPress={handleFilterButtonPress} />
              {hasAppliedFilters && (
                <Text style={styles.activeFiltersText}>Filters applied</Text>
              )}
            </View>
          )}

{/* No matching car parks message */}
          {noMatchingCarParks && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsTitle}>No Matching Parking Locations</Text>
              <Text style={styles.noResultsMessage}>
                There are no parking locations that match your current filter criteria.
              </Text>
              <Text style={styles.resetFiltersButton} onPress={handleResetFilters}>
                Reset Filters
              </Text>
            </View>
          )}

          {!isSearchFocused && !noMatchingCarParks && (
            <CarParkList
              data={filteredCarParks}
              bottomSheetPosition={bottomSheetPosition}
              onSelectCarPark={handleSelectCarPark}
            />
          )}
        </BottomSheet>
      )}

{/* Show selected carpark details */}
      {selectedCarPark && showSelectedCarParkSheet && (
        <CarParkBottomSheet
          selectedCarPark={selectedCarPark}
          onClose={handleCloseCarParkSheet}
          bottomSheetPosition={bottomSheetPosition}
        />
      )}

      {showFilterSheet && (
        <FilterBottomSheet
          onClose={handleFilterClose}
          bottomSheetPosition={bottomSheetPosition}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
          warning={filterWarning}
          onResetFilters={handleResetFilters}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeFiltersText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  spacer: {
    height: 40,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  noResultsMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  resetFiltersButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
    padding: 10,
  },
});

export default BottomSheetContainer;
