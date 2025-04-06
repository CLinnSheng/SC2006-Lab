import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import CarParkListItem from "./CarParkListItems";
import EVListItem from "./EVListItems";

interface CarParkListProps {
  data: any[];
  bottomSheetPosition: SharedValue<number>;
  onSelectCarPark: (carPark: any) => void;
}

const CarParkList = ({
  data,
  bottomSheetPosition,
  onSelectCarPark,
}: CarParkListProps) => {
  // Initial number of items to show
  const INITIAL_ITEMS_COUNT = 10;
  const [itemsToShow, setItemsToShow] = useState(INITIAL_ITEMS_COUNT);

  // Process data - limit number of items rendered without re-sorting
  // The data is already sorted by the parent component based on user preference
  const processedData = useMemo(() => {
    // Simply limit to itemsToShow without changing the order
    return data.slice(0, itemsToShow);
  }, [data, itemsToShow]);

  const flatListAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        bottomSheetPosition.value,
        [SCREEN_DIMENSIONS.height * 0.88, SCREEN_DIMENSIONS.height * 0.7],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      ),
    };
  });

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "CarPark") {
      return (
        <CarParkListItem item={item} onPress={() => onSelectCarPark(item)} />
      );
    } else if (item.type === "EV") {
      return <EVListItem item={item} onPress={() => onSelectCarPark(item)} />;
    }
    return null;
  };

  const loadMore = () => {
    setItemsToShow(prevCount => prevCount + 10);
  };

  return (
    <>
      <BottomSheetFlatList
        data={processedData}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        style={[styles.flatList, flatListAnimatedStyle]}
        initialNumToRender={5} // Performance optimization
        maxToRenderPerBatch={5} // Performance optimization
        windowSize={5} // Performance optimization
        ListFooterComponent={
          data.length > itemsToShow ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  flatList: {
    flex: 1,
  },
  loadMoreButton: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
    borderRadius: 8,
  },
  loadMoreText: {
    color: '#333',
    fontWeight: '600',
  }
});

export default CarParkList;
