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
import useCarParkSorting from "./hooks/useCarParkSorting";
import Filter from "./Filter";
import Sort, { SortOptions } from "./Sort";
import { decode } from "@googlemaps/polyline-codec";

const DEFAULT_FILTERS: FilterOptions = {
  distance: 1,
  vehicleType: "Car",
  evChargingAvailable: false,
  sheltered: null,
};

const DEFAULT_SORT: SortOptions = {
  sortBy: 'distance',
  direction: 'asc'
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
  const [sortSettings, setSortSettings] = useState<SortOptions>(DEFAULT_SORT);
  const [hasAppliedSort, setHasAppliedSort] = useState(false);

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


  const { 
    filteredCarParks, 
    wouldHaveResults, 
    noMatchingCarParks 
  } = useCarParkFilters(combinedListCarPark, filters);

  const {
    sortedCarParks
  } = useCarParkSorting(filteredCarParks);

  // Sheet navigation and management
  const handleSheetChanges = useCallback((index: number) => {
    setCurrentIndex(index);
    if (index < 2) {
      Keyboard.dismiss();
    }
  }, []);

  const expandBottomSheet = () => bottomSheetRef.current?.snapToIndex(2);
  const collapseBottomSheet = () => bottomSheetRef.current?.snapToIndex(1);

  // Search handlers
  const handleFocus = () => setIsSearchFocused(true);
  const handleBlur = () => setIsSearchFocused(false);

  const handleExitSearch = () => {
    resetToUserLocation();
    searchBarRef.current?.clearInput();
    collapseBottomSheet();
  };

  // Car park selection handlers
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

  // Filter handlers
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

    // Check if these filters would yield any results
    if (!wouldHaveResults(newFilters)) {
      setFilterWarning(
        "No parking locations match these filters. Please adjust your criteria."
      );
      return; // Don't close the sheet or apply the filters
    }

    // Apply the filters and close the sheet
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

  // Sort handlers
  const handleApplySort = (newSortSettings: SortOptions) => {
    console.log("Applied sort:", newSortSettings);
    setSortSettings(newSortSettings);
    setHasAppliedSort(true);
  };

  // Determine if we should show "no results" message
  const showNoResultsMessage = hasAppliedFilters && noMatchingCarParks;

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
            <View style={styles.actionButtonsContainer}>
              <View style={styles.buttonsGroup}>
                <Filter onPress={handleFilterButtonPress} />
                <Sort 
                  onApplySort={handleApplySort} 
                  currentSort={sortSettings} 
                />
              </View>
              <View>
                {(hasAppliedFilters || hasAppliedSort) && (
                  <Text style={styles.activeStatusText}>
                    {hasAppliedFilters && hasAppliedSort 
                      ? "Filters & sorting applied" 
                      : hasAppliedFilters 
                        ? "Filters applied" 
                        : "Sorting applied"}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* No matching car parks message */}
          {showNoResultsMessage && (
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

          {/* Only render the carpark list when the search bar is not focused and we have results */}
          {!isSearchFocused && !showNoResultsMessage && (
            <CarParkList
              data={sortedCarParks}
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

      {/* Show filter bottom sheet */}
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
  actionButtonsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsGroup: {
    flexDirection: "row",
    gap: 10,
  },
  activeStatusText: {
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
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "bold",
    padding: 10,
  },
});

export default BottomSheetContainer;
