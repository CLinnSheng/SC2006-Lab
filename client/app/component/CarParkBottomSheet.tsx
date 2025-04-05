import React, { useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  SharedValue,
  useSharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import carParkUtils from "../utils/carParkUtils";
import { Ionicons } from "@expo/vector-icons";

interface CarParkBottomSheetProps {
  selectedCarPark: any;
  onClose: () => void;
  bottomSheetPosition: SharedValue<number>;
}

// render the selected carpark details in a new bottomsheet
const CarParkBottomSheet = ({
  selectedCarPark,
  onClose,
  bottomSheetPosition,
}: CarParkBottomSheetProps) => {
  const selectedCarParkBottomSheetRef = useRef<BottomSheet>(null);
  const selectedCarParkBottomSheetPosition = useSharedValue(0);

  // to make the recenter map button stay above the inner bottom sheet
  useAnimatedReaction(
    () => selectedCarParkBottomSheetPosition.value,
    (currentPosition) => {
      bottomSheetPosition.value = currentPosition;
    }
  );

  const handleSheetChanges = useCallback((index: number) => {
    // Handle any sheet change logic
  }, []);

  const renderCarParkDetails = () => {
    if (selectedCarPark.type === "CarPark") {
      return (
        <>
          {selectedCarPark.latitude && selectedCarPark.longitude && (
            <Image
              style={styles.streetViewImage}
              source={{
                uri: carParkUtils.getStreetViewUrl(
                  selectedCarPark.latitude,
                  selectedCarPark.longitude
                ),
              }}
            />
          )}

          <Text style={styles.selectedCarParkDetails}>
            Address: {selectedCarPark.address}
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Type:{" "}
            {carParkUtils.getCarParkTypeLabel(selectedCarPark.carParkType)}{" "}
            <Text>`</Text>
            <Ionicons
              style={styles.ioniconStyle} // Apply the style to the Ionicon
              name={
                selectedCarPark.carParkType === "SURFACE CAR PARK"
                  ? "rainy"
                  : selectedCarPark.carParkType === "MULTI-STOREY CAR PARK"
                  ? "business-outline"
                  : selectedCarPark.carParkType === "BASEMENT CAR PARK"
                  ? "layers-outline"
                  : "help-outline"
              }
              size={22}
              color="black"
            />
          </Text>

          <Text style={styles.selectedCarParkDetails}>
            Lots Available:{" "}
            {selectedCarPark.lotDetails?.C?.availableLots !== undefined ? (
              <Text
                style={[
                  styles.availableLots,
                  {
                    color:
                      selectedCarPark.lotDetails.C.availableLots < 20
                        ? "red"
                        : selectedCarPark.lotDetails.C.availableLots < 100
                        ? "orange"
                        : "green",
                  },
                ]}
              >
                {selectedCarPark.lotDetails.C.availableLots}
              </Text>
            ) : (
              <Text style={styles.notAvailable}> Not Available</Text>
            )}
            {selectedCarPark.lotDetails?.C?.totalLots && (
              <Text style={{ color: "#777" }}>
                {" "}
                / {selectedCarPark.lotDetails.C.totalLots}
              </Text>
            )}
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Distance: {selectedCarPark.routeInfo.distance} KM
          </Text>
        </>
      );
    } else if (selectedCarPark.type === "EV") {
      return (
        <>
          <Image
            style={styles.streetViewImage}
            source={require("../../assets/ev.png")}
          />
          <Text style={styles.selectedCarParkDetails}>
            Address: {selectedCarPark.formattedAddress}
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Operator: {selectedCarPark.displayName}
          </Text>
          <Text
            style={[
              styles.selectedCarParkDetails,
              {
                color:
                  selectedCarPark.chargers[0].availableCount === "N/A"
                    ? "orange"
                    : selectedCarPark.chargers[0].availableCount < 2
                    ? "red"
                    : "green",
              },
            ]}
          >
            Chargers: {selectedCarPark.chargers[0].availableCount} /{" "}
            {selectedCarPark.totalChargers}
          </Text>

          <Text style={styles.selectedCarParkDetails}>
            Charge Rate: {selectedCarPark.chargers[0].maxChargeRateKW} kWh{" "}
            <Ionicons
              name="flash-outline"
              size={20}
              color="black"
              style={{ marginLeft: 0 }}
            />
          </Text>
        </>
      );
    }
    return null;
  };

  return (
    <BottomSheet
      ref={selectedCarParkBottomSheetRef}
      index={1}
      snapPoints={["13%", "45%"]}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: "#F5F5F7" }}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animatedPosition={selectedCarParkBottomSheetPosition}
    >
      <BottomSheetView style={styles.itemDetail}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="closecircle" size={20} color="grey" />
        </TouchableOpacity>

        {renderCarParkDetails()}

        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => console.log("Navigate pressed")}
        >
          <Text style={styles.navigateButtonText}>Navigate</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  // ... copy relevant styles from original file
  streetViewImage: {
    width: Platform.OS === "ios" ? "100%" : SCREEN_DIMENSIONS.width * 0.9,
    height: 150,
    marginTop: 30,
    borderRadius: 15,
    paddingHorizontal: 20,
    alignContent: "center",
    alignSelf: "center",
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
  availableLots: {
    fontWeight: "bold",
    color: "green",
  },
  notAvailable: {
    color: "#888",
    fontStyle: "italic",
  },
  selectedCarParkDetailsTitle: {
    fontFamily: "SourceCodePro-BlackIt",
    fontSize: 27,
    fontWeight: "bold",
    alignSelf: "center",
    color: "blue",
    marginBottom: 8,
    lineHeight: 40,
  },
  selectedCarParkDetails: {
    fontSize: 14,
    fontFamily: "ArialRoundedBold",
    color: "#FFFFF",
    lineHeight: 25,
    paddingHorizontal: 0,
    paddingVertical: -1,
    borderWidth: 0,
    alignSelf: "center",
    width: "90%",
    top: SCREEN_DIMENSIONS.height * 0.01,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ioniconStyle: {
    marginLeft: 2, // Adjust the margin to create space
  },

  navigateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 13,
    borderRadius: 12,
    width: SCREEN_DIMENSIONS.width * 0.9,
    alignSelf: "center",
    top: SCREEN_DIMENSIONS.height * 0.023,
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    bottom:
      Platform.OS === "ios"
        ? SCREEN_DIMENSIONS.height * 0.3228
        : SCREEN_DIMENSIONS.height * 0.3234,
    right: SCREEN_DIMENSIONS.width * 0.05,
    zIndex: 10,
  },
});

export default CarParkBottomSheet;
