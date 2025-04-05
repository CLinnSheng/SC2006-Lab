import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
      <Text style={styles.evStationTitle}>{item.displayName || "N/A"} </Text> 
      <FontAwesome5
          name="charging-station"
          size={20}
          color="#007bff"
          style={styles.iconContainer}
        />
        
      </View>
      
      <Text style={styles.itemDuration}>
        {item.routeInfo.duration} Minutes Away
        </Text>
        <Text
  style={[
    styles.itemDetail,
    {
      color:
        item.chargers?.[0]?.availableCount === "N/A"
          ? "orange"
          : item.chargers?.[0]?.availableCount <= "2"
          ? "red"
          : "green",
    },
  ]}
>
  Chargers: {item.chargers?.[0]?.availableCount} / {item.totalChargers}
  <MaterialCommunityIcons
    name="power-plug-outline"
    size={20}
    color="black"
    style={styles.iconContainer}
  />
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
    color: "#)))",
  },
  itemDetail: {
    fontSize: 15,
    color: "#000",
    marginBottom: 6,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontFamily: "Arial",
    textAlign: "left",
  },
  itemDuration: {
    fontSize: 15,
    color: "blue",
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
