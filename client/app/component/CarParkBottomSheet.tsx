import React, { useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  View,
  Linking,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  SharedValue,
  useSharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import getStreetViewUrl from "./hooks/getStreetViewImage";
import formatAddressToTitleCase from "../utils/convertCase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import getAvailabilityColor from "../utils/getAvailabilityColor";
import carParkUtils from "../utils/carParkUtils";
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

  const openGoogleMaps = useCallback(() => {
    let latitude;
    let longitude;

    if (selectedCarPark?.type === "CarPark") {
      latitude = selectedCarPark.latitude;
      longitude = selectedCarPark.longitude;
    } else if (selectedCarPark?.type === "EV") {
      latitude = selectedCarPark.location?.latitude;
      longitude = selectedCarPark.location?.longitude;
    }

    if (latitude && longitude) {
      const googleMapsUrl = Platform.select({
        ios: `maps://app?daddr=${latitude},${longitude}&dirflg=d`, // 'd' for driving directions
        android: `google.navigation:q=${latitude},${longitude}`,
      });

      Linking.openURL(googleMapsUrl ?? "").catch((err) =>
        console.error("An error occurred while opening Google Maps:", err)
      );
    } else {
      console.warn("Latitude and longitude are not available.");
    }
  }, [selectedCarPark]);

  const renderCarParkDetails = () => {
    if (selectedCarPark.type === "CarPark") {
      return (
        <>
          <View style={styles.selectedCarParkTitileContainer}>
            <Text style={styles.selectedCarParkTitle}>
              {formatAddressToTitleCase(selectedCarPark.address)}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.selectedCarParkType}>
              {formatAddressToTitleCase(selectedCarPark.carParkType)} ⋅{" "}
              {carParkUtils.getCarParkTypeLabel(selectedCarPark.carParkType)}
            </Text>
          </View>

          <View style={styles.distanceTimeContainer}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#007AFF"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.distanceTimeText}>
              {selectedCarPark.routeInfo.distance} km
            </Text>
            <Ionicons
              name="time-outline"
              size={16}
              color="#007AFF"
              style={{ marginLeft: 10, marginRight: 5 }}
            />
            <Text style={styles.distanceTimeText}>
              {Math.round(selectedCarPark.routeInfo.duration)} mins
            </Text>
          </View>
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

          <View style={styles.availabilityContainer}>
            {selectedCarPark.lotDetails?.C && (
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
                        selectedCarPark.lotDetails.C.availableLots,
                        selectedCarPark.lotDetails.C.totalLots
                      ),
                    },
                  ]}
                >
                  {selectedCarPark.lotDetails.C.availableLots}
                </Text>
                <Text style={{ marginLeft: 5, color: "#777", fontSize: 16 }}>
                  / {selectedCarPark.lotDetails.C.totalLots}
                </Text>
              </View>
            )}

            {selectedCarPark.lotDetails?.Y && (
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
                        selectedCarPark.lotDetails.Y.availableLots,
                        selectedCarPark.lotDetails.Y.totalLots
                      ),
                    },
                  ]}
                >
                  {selectedCarPark.lotDetails.Y.availableLots}
                </Text>
                <Text style={{ marginLeft: 5, color: "#777", fontSize: 16 }}>
                  / {selectedCarPark.lotDetails.Y.totalLots}
                </Text>
              </View>
            )}

            {selectedCarPark.lotDetails?.H && (
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
                        selectedCarPark.lotDetails.H.availableLots,
                        selectedCarPark.lotDetails.H.totalLots
                      ),
                    },
                  ]}
                >
                  {selectedCarPark.lotDetails.H.availableLots}
                </Text>
                <Text style={{ marginLeft: 5, color: "#777", fontSize: 16 }}>
                  / {selectedCarPark.lotDetails.H.totalLots}
                </Text>
              </View>
            )}
          </View>
        </>
      );
    } else if (selectedCarPark.type === "EV") {
      return (
        <>
          <View style={styles.selectedCarParkTitileContainer}>
            <Text style={styles.selectedCarParkTitle}>
              {selectedCarPark.shortFormattedAddress}
            </Text>
          </View>
          <Text style={styles.selectedCarParkType}>
            {selectedCarPark.displayName}
          </Text>
          <View style={styles.distanceTimeContainer}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#007AFF"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.distanceTimeText}>
              {selectedCarPark.routeInfo.distance} km
            </Text>
            <Ionicons
              name="time-outline"
              size={16}
              color="#007AFF"
              style={{ marginLeft: 10, marginRight: 5 }}
            />
            <Text style={styles.distanceTimeText}>
              {Math.round(selectedCarPark.routeInfo.duration)} mins
            </Text>
          </View>
          <Image
            style={styles.streetViewImage}
            source={{
              uri: getStreetViewUrl(
                selectedCarPark.location.latitude,
                selectedCarPark.location.longitude
              ),
            }}
          />
          {selectedCarPark.chargers && selectedCarPark.chargers.length > 0 ? (
            <View style={styles.evAvailabilityContainer}>
              {selectedCarPark.chargers.map((charger: any, index: any) => (
                <View key={index} style={styles.evChargerInfo}>
                  <Text style={styles.evChargerType}>
                    Type{" "}
                    {formatAddressToTitleCase(
                      charger.type
                        .replace(/EV_CONNECTOR_TYPE_/g, "")
                        .replace(/TYPE_/g, "")
                        .replace(/Ccs/g, "")
                        .replace(/_/g, " ")
                    )}
                  </Text>
                  <Text>{" ("}</Text>
                  <Text style={styles.evChargeRate}>
                    {""}
                    {charger.maxChargeRateKW} kW
                  </Text>
                  <Text>{"): "}</Text>
                  <Text
                    style={[
                      styles.evChargerCount,
                      {
                        color: getAvailabilityColor(
                          charger.availableCount,
                          charger.count
                        ),
                      },
                    ]}
                  >
                    {charger.availableCount === "N/A"
                      ? "N/A"
                      : `${charger.availableCount}`}
                  </Text>
                  <Text style={{ fontSize: 16 }}> / {charger.count}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noInfoContainer}>
              <Text style={styles.noInfoText}>
                Charging information not available.
              </Text>
            </View>
          )}
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
      <BottomSheetView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="closecircle" size={16} color="grey" />
        </TouchableOpacity>

        {renderCarParkDetails()}

        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => {
            console.log("Navigate pressed");
            openGoogleMaps();
          }}
        >
          <Text style={styles.navigateButtonText}>NAVIGATE</Text>
          <Ionicons
            name="navigate-outline"
            size={20}
            color="white"
            style={{ marginTop: -20, marginLeft: 130 }}
          />
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  streetViewImage: {
    width: SCREEN_DIMENSIONS.width * 0.91,
    height: 150,
    marginTop: 10,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 10,
  },
  selectedCarParkTitileContainer: {
    width: SCREEN_DIMENSIONS.width * 0.9,
  },
  selectedCarParkTitle: {
    fontFamily: "Futura",
    fontSize: 23,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
    padding: 12,
  },
  selectedCarParkType: {
    marginLeft: 20,
    color: "#777",
    fontSize: 17,
    fontFamily: "ArialRoundedBold",
  },
  selectedCarParkTypeLabel: {
    fontSize: 16,
    fontFamily: "ArialRoundedBold",
    color: "#777",
    marginLeft: 10,
    // marginTop: 5,
  },
  evAvailabilityContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 1,
  },
  evAvailabilityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  evChargerInfo: {
    flexDirection: "row",
    marginBottom: 4,
  },
  evChargerType: {
    fontSize: 16,
    color: "#333",
  },
  evChargerCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  evChargeRate: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
  navigateButton: {
    position: "absolute",
    backgroundColor: "#007AFF",
    paddingVertical: 13,
    borderRadius: 12,
    width: SCREEN_DIMENSIONS.width * 0.9,
    height: SCREEN_DIMENSIONS.height * 0.06,
    top: SCREEN_DIMENSIONS.height * 0.43,
    alignContent: "center",
    alignSelf: "center",
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    alignContent: "center",
    textAlign: "center",
    marginTop: 4,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 10 : 8,
    // bottom:
    //   Platform.OS === "ios"
    //     ? SCREEN_DIMENSIONS.height * 0.389
    //     : SCREEN_DIMENSIONS.height * 0.35,
    right: SCREEN_DIMENSIONS.width * 0.05,
    zIndex: 10,
  },
  availabilityContainer: {
    flexDirection: "column", // Changed to column for row by row
    gap: 8, // Adds spacing between each row
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 1,
  },
  lotInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 20,
  },
  availabilityCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  distanceTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 19,
    marginTop: 5,
  },
  distanceTimeText: {
    fontSize: 15,
    color: "#77",
  },
  noInfoContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  noInfoText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});

export default CarParkBottomSheet;
