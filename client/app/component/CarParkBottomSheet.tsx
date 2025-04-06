import React, { useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  View
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

          <Text style={styles.selectedCarParkDetailsTitle}>
            {selectedCarPark.address}
          </Text>
          <Text style={styles.selectedCarParkDetailsMin}>
            {selectedCarPark.routeInfo.duration} Minutes From Your Location
          </Text>
          <Text style={styles.selectedCarParkDetails}>
            {" "}
            {carParkUtils.getCarParkTypeLabel(selectedCarPark.carParkType)}{" "}
            <Text></Text>
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

          <Text style={styles.selectedCarParkDetailsLots}>
  Lots:{" "}
  {selectedCarPark.lotDetails?.C?.availableLots !== undefined ? (
    <Text
      style={[
        styles.availableLots,
        {
          color: (() => {
            // Calculate the ratio of available to total lots
            const availableLots = selectedCarPark.lotDetails.C.availableLots;
            const totalLots = selectedCarPark.lotDetails.C.totalLots;

            // Avoid division by zero
            if (totalLots && availableLots) {
              const ratio = availableLots / totalLots;
              // Determine the color based on the ratio
              if (ratio < 0.2) return "red"; // Less than 20% available
              if (ratio < 0.5) return "orange"; // Less than 50% available
              return "green"; // More than 50% available
            }
            return "gray"; // Default color if data is missing or invalid
          })(),
        },
      ]}
    >
      {selectedCarPark.lotDetails.C.availableLots}
    </Text>
  ) : (
    <Text style={styles.notAvailable}>Not Available</Text>
  )}
</Text>

          <Text style={styles.selectedCarParkDetailsDist}>
            {selectedCarPark.routeInfo.distance} KM
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
          <Text style={styles.selectedCarParkDetailsTitle}>
          {selectedCarPark.formattedAddress}
          </Text>
          <Text style={styles.selectedCarParkDetailsMin}>
            {selectedCarPark.routeInfo.duration} Minutes From Your Location
          </Text>
          <Text style={styles.selectedCarParkDetailsDist}>
          {selectedCarPark.displayName}
          </Text>
          <Text style={styles.selectedCarParkDetailsLots}>
  Lots:{" "}
  <Text
    style={[
      {
        color:
        selectedCarPark.chargers[0].availableCount === "N/A"
        ? "black"
        : selectedCarPark.chargers[0].availableCount < 2
        ? "red"
        : "green",
      },
    ]}
  >
    {selectedCarPark.chargers[0].availableCount}
  </Text>
</Text>

          <Text style={styles.selectedCarParkDetails}>
            Charge Rate: {selectedCarPark.chargers[0].maxChargeRateKW} kWh
            
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
      snapPoints={["10%", "55%"]}
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
  <Ionicons name="navigate-outline" size={20} color="white" style={{ marginTop: -19, marginLeft:145 }} />
</TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  // ... copy relevant styles from original file
  streetViewImage: {
    width: Platform.OS === "ios" ? "105%" : SCREEN_DIMENSIONS.width * 0.9,
    height: 120,
    marginTop: 45,
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
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: 'baseline',
    color: "black",
    marginBottom: 3,
    marginTop: 30,
    marginLeft: 20,
    lineHeight: 40,
  },
  selectedCarParkDetailsMin:{
    fontSize: 15,
    fontFamily: "ArialRoundedBold",
    color: "rgb(35, 151, 189)",
    marginLeft: 20,
    marginTop: 0,
    

  },
  selectedCarParkDetails: {
    fontSize: 14,
    fontFamily: "ArialRoundedBold",
    color: "#FFFFF",
    lineHeight: 25,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderWidth: 0,
    marginTop:20,
    marginLeft: -200,
    alignSelf: "center",
    width: SCREEN_DIMENSIONS.width * 0.45,
    height: SCREEN_DIMENSIONS.height * 0.06,
    backgroundColor: "rgb(223, 224, 224)",
    borderRadius: 12,
    textAlign: "center", // Horizontally center the text
    justifyContent: "center", // Vertically center the text
    alignItems: "center", // Vertically center the text
    flexDirection: 'row', // Ensure flexbox layout for centering
    display: 'flex', // Enable flexbox on the container

    top: SCREEN_DIMENSIONS.height * 0.015,
  },
  selectedCarParkDetailsLots: {
    fontSize: 14,
    fontFamily: "ArialRoundedBold",
    color: "#FFFFF",
    lineHeight: 25,
    paddingHorizontal: 65,
    paddingVertical: 13,
    width: SCREEN_DIMENSIONS.width * 0.45,
    height: SCREEN_DIMENSIONS.height * 0.06,
    borderWidth: 0,
    marginTop:-56,
    marginLeft: 200,
    borderRadius: 12,

    alignSelf: "center",
    backgroundColor: "rgb(223, 224, 224)",
    top: SCREEN_DIMENSIONS.height * 0.015,
  },
  selectedCarParkDetailsDist: {
    fontSize: 14,
    borderRadius: 12,

    fontFamily: "ArialRoundedBold",
    color: "#FFFFF",
    lineHeight: 25,
    paddingHorizontal: 35,
    paddingVertical: 13,
    borderWidth: 0,
    marginTop:20,
    marginLeft: -200,
    alignSelf: 'center',
    width: SCREEN_DIMENSIONS.width * 0.45,
    height: SCREEN_DIMENSIONS.height * 0.06,
    backgroundColor: "rgb(223, 224, 224)",
    top: SCREEN_DIMENSIONS.height * 0.015,
    textAlign: "center", // Horizontally center the text
    justifyContent: "center", // Vertically center the text
    alignItems: "center", // Vertically center the text
    flexDirection: 'row', // Ensure flexbox layout for centering
    display: 'flex', // Enable flexbox on the container
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
    width: SCREEN_DIMENSIONS.width * 0.45,
    height: SCREEN_DIMENSIONS.height * 0.06,
    marginLeft: 218,
    marginTop:-65,
    top: SCREEN_DIMENSIONS.height * 0.025,
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop:4,
    marginLeft: -1,
  },
  closeButton: {
    position: "absolute",
    bottom:
      Platform.OS === "ios"
        ? SCREEN_DIMENSIONS.height * 0.389
        : SCREEN_DIMENSIONS.height * 0.3234,
    right: SCREEN_DIMENSIONS.width * 0.05,
    zIndex: 10,
  },
});

export default CarParkBottomSheet;
