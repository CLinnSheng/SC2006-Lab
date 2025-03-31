import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EVListItemProps {
  item: any;
  onPress: () => void;
}

// render all the ev lots
const EVListItem = ({ item, onPress }: EVListItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: "white" }]}
      onPress={onPress}
    >
      <View style={styles.titleContainer}>
        <Ionicons
          name="flash-outline"
          size={20}
          color="#007bff"
          style={styles.iconContainer}
        />
        <Text style={styles.evStationTitle}>{item.displayName || "N/A"}</Text>
      </View>
      <Text style={styles.itemDetail}>
        Chargers: {item.location.latitude || "N/A"}
      </Text>
      <Text style={styles.itemDetail}>
        Operator: {item.operator || "Unknown"}
      </Text>
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
  evStationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    color: "#007bff",
  },
  itemDetail: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontFamily: "Arial",
    textAlign: "left",
  },
  iconContainer: {
    marginBottom: 5,
  },
});

export default EVListItem;
