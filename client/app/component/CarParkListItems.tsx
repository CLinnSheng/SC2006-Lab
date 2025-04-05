import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import carParkUtils from "../utils/carParkUtils";
import { Ionicons } from "@expo/vector-icons";

interface CarParkListItemProps {
  item: any;
  onPress: () => void;
}

// render all the carpark lots
const CarParkListItem = ({ item, onPress }: CarParkListItemProps) => {
  console.log("CarParkListItem item:", JSON.stringify(item, null, 2)); // Log the full object

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
            {item.routeInfo.duration} Minutes Away
          </Text>
          
          {/* Car lots */}
  {"C" in item.lotDetails && (
    <View style={styles.lotRow}>
      <Ionicons name="car-outline" size={20} color="#333" />
      <Text style={styles.lotDetailsText}> Car: </Text>
      <Text
        style={{
          color:
            item.lotDetails.C.availableLots < 20
              ? "red"
              : item.lotDetails.C.availableLots <= 50
              ? "orange"
              : "green",
          fontWeight: "bold",
        }}
      >
        {item.lotDetails.C.availableLots} / {item.lotDetails.C.totalLots}
      </Text>
    </View>
  )}

  {/* Motorcycle lots */}
  {"Y" in item.lotDetails && (
    <View style={styles.lotRow}>
      <Ionicons name="bicycle-outline" size={20} color="#333" />
      <Text style={styles.lotDetailsText}> Motorcycle: </Text>
      <Text
        style={{
          color:
            item.lotDetails.Y.availableLots < 5
              ? "red"
              : item.lotDetails.Y.availableLots <= 10
              ? "orange"
              : "green",
          fontWeight: "bold",
        }}
      >
        {item.lotDetails.Y.availableLots} / {item.lotDetails.Y.totalLots}
      </Text>
    </View>
  )}

  {/* Heavy vehicle lots */}
  {"H" in item.lotDetails && (
    <View style={styles.lotRow}>
      <Ionicons name="bus-outline" size={20} color="#333" />
      <Text style={styles.lotDetailsText}> Heavy Vehicle: </Text>
      <Text
        style={{
          color:
            item.lotDetails.H.availableLots < 5
              ? "red"
              : item.lotDetails.H.availableLots <= 10
              ? "orange"
              : "green",
          fontWeight: "bold",
        }}
      >
        {item.lotDetails.H.availableLots} / {item.lotDetails.H.totalLots}
      </Text>
    </View>
  )}
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
    fontSize: 14,
    marginBottom: 2,
    marginLeft: 20,
    flexShrink: 1, 
  maxWidth: "90%", 
    color: "#333",
  },
  moreDetailsText: {
    fontSize: 14,
    color: "blue",
    marginTop: 1,
    marginLeft: 20,
    borderWidth: 0,
    borderRadius: 8,
    padding: 2,
    borderColor: "#000",
  },
  streetViewImageList: {
    width: 70,
    height: 70,
    marginTop: 3,
    borderRadius: 15,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  lotRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
    marginLeft: 20,
  },
  lotDetailsText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
});

export default CarParkListItem;