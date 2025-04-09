// RouteDisplay.tsx
import React from "react";
import { Polyline, Marker } from "react-native-maps";
import { decode } from "@googlemaps/polyline-codec";

interface RouteDisplayProps {
  selectedCarPark: any;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({ selectedCarPark }) => {
  return (
    <>
      <Polyline
        coordinates={decode(selectedCarPark.routeInfo.polyline).map(
          (point: any) => ({
            latitude: point[0],
            longitude: point[1],
          })
        )}
        strokeWidth={6}
        strokeColor="#007AFF"
      />
      <Marker
        coordinate={{
          latitude:
            selectedCarPark.latitude ?? selectedCarPark.location?.latitude,
          longitude:
            selectedCarPark.longitude ?? selectedCarPark.location?.longitude,
        }}
        pinColor={selectedCarPark.type === "CarPark" ? "red" : "green"}
        ref={(ref) => {
          if (ref) {
            setTimeout(() => ref.showCallout(), 100);
          }
        }}
      />
    </>
  );
};

export default RouteDisplay;
