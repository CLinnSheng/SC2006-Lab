// MapMarkers.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Marker, Callout } from "react-native-maps";
import getStreetViewUrl from "../hooks/getStreetViewImage";

interface MapMarkersProps {
  carParks: any[];
  isVisible: boolean;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ carParks, isVisible }) => {
  if (!isVisible || !carParks) return null;

  return (
    <>
      {carParks.map((lot, index) => {
        const latitude = lot.latitude ?? lot.location?.latitude ?? 0;
        const longitude = lot.longitude ?? lot.location?.longitude ?? 0;

        return (
          <Marker
            key={index}
            coordinate={{ latitude, longitude }}
            pinColor={lot.type === "EV" ? "green" : "red"}
          >
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle} numberOfLines={1}>
                  {lot.displayName ?? lot.address ?? lot.shortFormattedAddress}
                </Text>
                <Image
                  source={{
                    uri: getStreetViewUrl(latitude, longitude),
                  }}
                  style={styles.calloutImage}
                  resizeMode="cover"
                />
              </View>
            </Callout>
          </Marker>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
  },
});

export default MapMarkers;
