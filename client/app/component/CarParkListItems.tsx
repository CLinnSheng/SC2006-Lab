import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStreetViewUrl, getCarParkTypeLabel } from "../utils/carParkUtils";

interface CarParkListItemProps {
  item: any;
  onPress: () => void;
}

const CarParkListItem = ({ item, onPress }: CarParkListItemProps) => {
  const getCarParkIcon = (type: string) => {
    switch (type) {
      case "MULTI-STOREY CAR PARK":
         return "business-outline"; // Sheltered, so use a building icon
       case "SURFACE CAR PARK":
         return "car-outline"; // Unsheltered, so use a car icon
       case "BASEMENT CAR PARK":
         return "download-outline"; // Basement, so use a downward arrow
       case "SURFACE/MULTI-STOREY CAR PARK":
         return "business-outline";
      
    }
  };
  const handlePress = () => {
    // Log the item data when pressed
    console.log("Car Park Item Pressed:", item);
    if (onPress) {
      onPress();
    }
  };


  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: "white" }]}
      onPress={handlePress}
    >
      <View style={[styles.titleContainer]}>
        <Image
          style={styles.streetViewImageList}
          source={{
            uri: getStreetViewUrl(item.latitude, item.longitude),
          }}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.carParkTitle}>{item.address || "N/A"}</Text>
          <View style={styles.carParkTypeContainer}>
            
            <Text style={styles.carParkType}>
              Type: {getCarParkTypeLabel(item.carParkType)} <Ionicons
              name={getCarParkIcon(item.carParkType)}
              size={16}
              color="#555"
            />
            </Text>
          </View>
          <Text
            style={[styles.availableLots, {
              color:
                item.lotDetails?.C?.availableLots < 20
                  ? "red"
                  : item.lotDetails?.C?.availableLots <= 50
                  ? "orange"
                  : "green",
            }]}
          >
Lots Available: {item.lotDetails?.C?.availableLots ?? "N/A"} / {item.lotDetails?.C?.totalLots ?? "N/A"}
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
  carParkTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  carParkType: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  availableLots: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 8,
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