import React from "react";
import { StyleSheet } from "react-native";
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
    // console.log(item);
    if (item.type === "CarPark") {
      return (
        <CarParkListItem item={item} onPress={() => onSelectCarPark(item)} />
      );
    } else if (item.type === "EV") {
      // console.log(item);
      return <EVListItem item={item} onPress={() => onSelectCarPark(item)} />;
    }
    return null;
  };

  return (
    <BottomSheetFlatList
      data={data}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      style={[styles.flatList, flatListAnimatedStyle]}
    />
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
});

export default CarParkList;
