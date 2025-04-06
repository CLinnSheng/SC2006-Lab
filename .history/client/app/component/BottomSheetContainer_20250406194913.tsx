import React, { useCallback, useContext, useState, useRef } from "react";
import { StyleSheet, Keyboard, View } from "react-native";
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

// Default filter values
const DEFAULT_FILTERS: FilterOptions = {
  distance: 2, // 2km default
  vehicleType: 'Car',
  evChargingAvailable: false,
  sheltered: null, // null means "don't filter based on this"
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
  
  // Use our new custom hook for filtering car parks
  const filteredCarParks = useCarParkFilters(combinedListCarPark, filters);

  // Handlers
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

  // Exit the search and reset the map
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

  // Close the bottom sheet for car park details
  const handleCloseCarParkSheet = () => {
    setShowSelectedCarParkSheet(false);
    setSelectedCarPark(null);
    onSelectCarPark(null);
  };

  // Filter handlers
  const handleFilterButtonPress = () => {
    console.log("Opening filter bottom sheet");
    setShowFilterSheet(true);
  };

  const handleFilterClose = () => {
    console.log("Closing filter bottom sheet");
    setShowFilterSheet(false);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    console.log("Applied filters:", newFilters);
    setFilters(newFilters);
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
            </View>
          )}

          {/* Only render the carpark list when the search bar is not focus */}
          {!isSearchFocused && (
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

      {/* Show filter bottom sheet */}
      {showFilterSheet && (
        <FilterBottomSheet
          onClose={handleFilterClose}
          bottomSheetPosition={bottomSheetPosition}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
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
  },
  spacer: {
    height: 40,
  },
});

export default BottomSheetContainer;
