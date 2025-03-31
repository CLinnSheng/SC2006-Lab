import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import carParkUtils from "../utils/carParkUtils";

interface CarParkListItemProps {
  item: any;
  onPress: () => void;
}

// render all the carpark lots
const CarParkListItem = ({ item, onPress }: CarParkListItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: "white" }]}
      onPress={onPress}
    >
      <View style={[styles.titleContainer]}>
        <Image
          style={styles.streetViewImageList}
          source={{
            uri: carParkUtils.getStreetViewUrl(item.latitude, item.longitude),
          }}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.carParkTitle}>{item.address || "N/A"}</Text>
          <Text style={styles.moreDetailsText}>
            Press more for details
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "transparent",
    flexDirection: "column",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  carParkTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    marginLeft: 8,
    color: "#333",
  },
  moreDetailsText: {
    fontSize: 14,
    color: "#007bff",
    marginTop: 5,
    marginLeft: 10,
  },
  streetViewImageList: {
    width: 60,
    height: 60,
    marginTop: 10,
    borderRadius: 15,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export default CarParkListItem;