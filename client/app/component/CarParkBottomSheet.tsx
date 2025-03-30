import React, { useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
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
import { getStreetViewUrl, getCarParkTypeLabel } from "../utils/carParkUtils";

interface CarParkBottomSheetProps {
  selectedCarPark: any;
  onClose: () => void;
  bottomSheetPosition: SharedValue<number>;
}

const CarParkBottomSheet = ({
  selectedCarPark,
  onClose,
  bottomSheetPosition,
}: CarParkBottomSheetProps) => {
  const selectedCarParkBottomSheetRef = useRef<BottomSheet>(null);
  const selectedCarParkBottomSheetPosition = useSharedValue(0);

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
                uri: getStreetViewUrl(
                  selectedCarPark.latitude,
                  selectedCarPark.longitude
                ),
              }}
            />
          )}

          <Text style={styles.selectedCarParkDetails}>
            Car Park ID: {selectedCarPark.carParkID}
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Address: {selectedCarPark.address}
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Type: {getCarParkTypeLabel(selectedCarPark.carParkType)}
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
              <Text style={styles.notAvailable}> N/A</Text>
            )}
            {selectedCarPark.lotDetails?.C?.totalLots && (
              <Text style={{ color: "#777" }}>
                {" "}
                / {selectedCarPark.lotDetails.C.totalLots}
              </Text>
            )}
          </Text>
        </>
      );
    } else if (selectedCarPark.type === "EV") {
      return (
        <>
          <Text style={styles.selectedCarParkDetailsTitle}>
            EV Station Details
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Display Name: {selectedCarPark.displayName}
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Chargers: {selectedCarPark.totalChargers}
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            Operator: {selectedCarPark.operator}
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
          <AntDesign name="closecircle" size={16} color="grey" />
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
    paddingVertical: 0,
    borderWidth: 0,
    alignSelf: "center",
    width: "90%",
    top: SCREEN_DIMENSIONS.height * 0.01,
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
        ? SCREEN_DIMENSIONS.height * 0.33
        : SCREEN_DIMENSIONS.height * 0.35,
    right: SCREEN_DIMENSIONS.width * 0.05,
    zIndex: 10,
  },
});

export default CarParkBottomSheet;
