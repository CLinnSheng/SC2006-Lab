import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import carParkUtils from "../utils/carParkUtils";
import { FontAwesome } from "@expo/vector-icons"; // Ensure you have this installed: npm install @expo/vector-icons
import formatAddressToTitleCase from "../utils/convertCase";
import getAvailabilityColor from "../utils/getAvailabilityColor";
interface CarParkListItemProps {
  item: any;
  onPress: () => void;
}

const CarParkListItem = ({ item, onPress }: CarParkListItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: "white" }]}
      onPress={onPress}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {formatAddressToTitleCase(item.address) || "N/A"}
        </Text>
        <Text style={styles.secondaryInfoText}>
          {carParkUtils.getCarParkTypeLabel(item.carParkType)} ⋅{" "}
          {item.routeInfo?.distance} km ⋅ {item.routeInfo?.duration} mins
        </Text>

        <View style={styles.availabilityContainer}>
          {item.lotDetails?.C && (
            <View style={styles.lotInfo}>
              <FontAwesome
                name="car"
                size={16}
                color="#777"
                style={styles.icon}
              />
              <Text
                style={[
                  styles.availabilityCount,
                  {
                    color: getAvailabilityColor(
                      item.lotDetails.C.availableLots,
                      item.lotDetails.C.totalLots
                    ),
                  },
                ]}
              >
                {item.lotDetails.C.availableLots}
              </Text>
            </View>
          )}

          {item.lotDetails?.Y && (
            <View style={styles.lotInfo}>
              <FontAwesome
                name="motorcycle"
                size={16}
                color="#777"
                style={styles.icon}
              />
              <Text
                style={[
                  styles.availabilityCount,
                  {
                    color: getAvailabilityColor(
                      item.lotDetails.Y.availableLots,
                      item.lotDetails.Y.totalLots
                    ),
                  },
                ]}
              >
                {item.lotDetails.Y.availableLots}
              </Text>
            </View>
          )}

          {item.lotDetails?.H && (
            <View style={styles.lotInfo}>
              <FontAwesome
                name="truck"
                size={16}
                color="#777"
                style={styles.icon}
              />
              <Text
                style={[
                  styles.availabilityCount,
                  {
                    color: getAvailabilityColor(
                      item.lotDetails.H.availableLots,
                      item.lotDetails.H.totalLots
                    ),
                  },
                ]}
              >
                {item.lotDetails.H.availableLots}
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
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  secondaryInfoText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 5, // Add a little space from the secondary info
  },
  lotInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  icon: {
    marginRight: 10,
  },
  availabilityCount: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CarParkListItem;
// ⋅
