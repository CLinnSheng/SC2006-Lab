import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getAvailabilityColor from "../utils/getAvailabilityColor";

interface EVListItemProps {
  item: any;
  onPress: () => void;
}

const EVListItem = ({ item, onPress }: EVListItemProps) => {
  const getTotalAvailableCount = (
    chargers: any[] | undefined
  ): number | null => {
    if (!chargers || chargers.length === 0) {
      return null;
    }

    let totalAvailable = 0;
    for (const charger of chargers) {
      const availableCount = parseInt(charger.availableCount, 10);
      if (isNaN(availableCount)) {
        return null;
      }
      totalAvailable += availableCount;
    }
    return totalAvailable;
  };

  const totalAvailable = getTotalAvailableCount(item.chargers);
  const totalCapacity = parseInt(item.totalChargers ?? 0, 10);

  const availabilityText =
    typeof totalAvailable === "number"
      ? `${totalAvailable}`
      : totalCapacity > 0
      ? `${totalCapacity}`
      : "N/A";

  const availabilityColor =
    typeof totalAvailable === "number"
      ? getAvailabilityColor(totalAvailable, totalCapacity)
      : availabilityText !== "N/A"
      ? "green"
      : "#999";

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: "white" }]}
      onPress={onPress}
    >
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
            {item.displayName || "N/A"}
          </Text>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={20}
            color="#11d218"
          />
        </View>
        {item.routeInfo?.duration !== undefined && (
          <Text style={styles.secondaryInfoText}>
            {item.routeInfo.duration} mins ⋅ {item.routeInfo.distance} km ⋅{" "}
            {item.shortFormattedAddress}
          </Text>
        )}
        <View style={styles.availabilityContainer}>
          <View style={styles.lotInfo}>
            <MaterialCommunityIcons
              name="power-plug"
              size={16}
              color="#777"
              style={styles.icon}
            />
            <Text
              style={[
                styles.availabilityCount,
                {
                  color: availabilityColor,
                },
              ]}
            >
              {availabilityText}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  secondaryInfoText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
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

export default EVListItem;
