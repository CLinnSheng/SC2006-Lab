import { Image, StyleSheet, Text, View } from "react-native";
import filterUtils from "../utils/filterUtils";

const EmptyList = (selectedFilter: any) => {
  const getEmptyStateMessage = () => {
    switch (selectedFilter) {
      case filterUtils.FILTER_TYPES.EV:
        return "No EV charging stations found in this area";
      case filterUtils.FILTER_TYPES.CAR:
        return "No car parking spots available";
      case filterUtils.FILTER_TYPES.MOTORCYCLE:
        return "No motorcycle parking spots available";
      case filterUtils.FILTER_TYPES.HEAVY:
        return "No heavy vehicle parking spots available";
      default:
        return "No parking spots found with current filters";
    }
  };

  return (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require("../../assets/iamges/no-results.png")}
        style={styles.emptyStateImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateText}>{getEmptyStateMessage()}</Text>
      <Text style={styles.emptyStateSubText}>
        Try changing your filters or search in a different area
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  emptyStateSubText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
});

export default EmptyList;
