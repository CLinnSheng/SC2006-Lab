import React, { useCallback, useContext, useState, useRef } from "react";
import { StyleSheet, Keyboard, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { SharedValue } from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";
import { UserLocationContext } from "../context/userLocation";
import CarParkList from "./CarParkList";
import CarParkBottomSheet from "./CarParkBottomSheet";
import useCarParkData from "./hooks/useCarParkData";
import useBottomSheetAnimation from "./hooks/useBottomSheetAnimation";
import filterUtils from "../utils/filterUtils";
import FilterDropdown from "./FilterDropDown";
import EmptyList from "./EmptyList";
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

  // Filter and sort states
  const [selectedFilter, setSelectedFilter] = useState(
    filterUtils.FILTER_TYPES.ALL
  );
  const [selectedSort, setSelectedSort] = useState(
    filterUtils.SORT_BY.DISTANCE
  );

  // State
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCarPark, setSelectedCarPark] = useState<any | null>(null);
  const [showSelectedCarParkSheet, setShowSelectedCarParkSheet] =
    useState(false);

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

  const [searchedCarpark, setSearchedCarpark] = useState<boolean>(false);

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
    setSelectedFilter(filterUtils.FILTER_TYPES.ALL);
    setSelectedSort(filterUtils.SORT_BY.DISTANCE);
  };

  const handleSelectCarPark = (carPark: any) => {
    setSelectedCarPark(carPark);
    setShowSelectedCarParkSheet(true);
    // console.log(decode(carPark.routeInfo.polyline));
    onSelectCarPark(carPark);
  };

  // Close the bottom sheet for car park details
  const handleCloseCarParkSheet = () => {
    setShowSelectedCarParkSheet(false);
    setSelectedCarPark(null);
    onSelectCarPark(null);
  };

  const filteredCarParks = React.useMemo(() => {
    let filtered = [...combinedListCarPark];

    // Apply filter
    if (selectedFilter !== filterUtils.FILTER_TYPES.ALL) {
      filtered = filtered.filter((carPark) => {
        // EV
        if (selectedFilter === filterUtils.FILTER_TYPES.EV) {
          return carPark.type === "EV";
        }

        // For CarPark
        if (carPark.type === "CarPark") {
          if (selectedFilter === filterUtils.FILTER_TYPES.CAR) {
            return (
              carPark.lotDetails?.C &&
              carPark.lotDetails.C.availableLots !== undefined
            );
          } else if (selectedFilter === filterUtils.FILTER_TYPES.MOTORCYCLE) {
            return (
              carPark.lotDetails?.Y &&
              carPark.lotDetails.Y.availableLots !== undefined
            );
          } else if (selectedFilter === filterUtils.FILTER_TYPES.HEAVY) {
            return (
              carPark.lotDetails?.H &&
              carPark.lotDetails.H.availableLots !== undefined
            );
          }
        }
        return false;
      });
    }

    filtered.sort((a, b) => {
      if (selectedSort === filterUtils.SORT_BY.DISTANCE) {
        const distanceA = a.routeInfo?.distance || 0;
        const distanceB = b.routeInfo?.distance || 0;
        return distanceA - distanceB;
      } else if (selectedSort === filterUtils.SORT_BY.AVAILABLITY) {
        if (a.type === "EV" && b.type === "EV") {
          const getTotalAvailable = (item: any) => {
            if (!item.chargers || item.chargers.length === 0) return 0;

            let total = 0;
            for (const charger of item.chargers) {
              const available = parseInt(charger.availableCount, 10);
              if (!isNaN(available)) total += available;
            }
            return total;
          };
          const totalA = getTotalAvailable(a);
          const totalB = getTotalAvailable(b);
          return totalB - totalA;
        }

        if (a.type === "CarPark" && b.type === "CarPark") {
          let availableA = 0;
          let availableB = 0;

          if (
            selectedFilter === filterUtils.FILTER_TYPES.CAR ||
            selectedFilter === filterUtils.FILTER_TYPES.ALL
          ) {
            availableA = a.lotDetails?.C?.availableLots || 0;
            availableB = b.lotDetails?.C?.availableLots || 0;
          } else if (selectedFilter === filterUtils.FILTER_TYPES.MOTORCYCLE) {
            availableA = a.lotDetails?.Y?.availableLots || 0;
            availableB = b.lotDetails?.Y?.availableLots || 0;
          } else if (selectedFilter === filterUtils.FILTER_TYPES.HEAVY) {
            availableA = a.lotDetails?.H?.availableLots || 0;
            availableB = b.lotDetails?.H?.availableLots || 0;
          }
          return availableB - availableA;
        }
        return 0;
      }
      return 0;
    });
    return filtered;
  }, [combinedListCarPark, selectedFilter, selectedSort]);

  // Handle filter and sort changes
  const handleFilterChange = (filterType: any) => {
    setSelectedFilter(filterType);
  };

  const handleSortChange = (sortType: any) => {
    setSelectedSort(sortType);
  };

  return (
    <>
      {!showSelectedCarParkSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: "white" }}
          onAnimate={handleAnimate}
          enablePanDownToClose={false}
          animatedPosition={bottomSheetPosition}
          enableDynamicSizing={false}
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
              setSelectFilter={setSelectedFilter}
              setSelectSort={setSelectedSort}
              searchedCarpark={searchedCarpark}
              setSearchedCarpark={setSearchedCarpark}
            />
          </View>

          {!isSearchFocused && (
            <FilterDropdown
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              selectedFilter={selectedFilter}
              selectedSort={selectedSort}
            />
          )}

          <View style={styles.spacer} />

          {/* Only render the carpark list when the search bar is not focus */}
          {!isSearchFocused && filteredCarParks.length > 0 ? (
            <CarParkList
              data={filteredCarParks}
              bottomSheetPosition={bottomSheetPosition}
              onSelectCarPark={handleSelectCarPark}
            />
          ) : (
            !isSearchFocused && <EmptyList selectedFilter={selectedFilter} />
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
    </>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  spacer: {
    height: 30,
  },
});

export default BottomSheetContainer;
