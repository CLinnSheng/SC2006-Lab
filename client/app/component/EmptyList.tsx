import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import filterUtils from "../utils/filterUtils";

const EmptyList = ({
  selectedFilter,
  isLoading,
}: {
  selectedFilter: any;
  isLoading: boolean;
}) => {
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

  if (isLoading) {
    return (
      <View style={styles.loadingStateContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Searching for parking spots...</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require("../../assets/images/no-results.png")}
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
  loadingStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 80,
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
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginTop: 16,
  },
});

export default EmptyList;
