import React, { useContext, useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  Extrapolate,
  interpolate,
} from "react-native-reanimated";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import { UserLocationContext } from "../context/userLocation";
import getWeatherIcon from "./hooks/getWeatherData";

interface InfoButtonProps {
  bottomSheetPosition: Animated.SharedValue<number>;
}

const WeatherButton: React.FC<InfoButtonProps> = ({ bottomSheetPosition }) => {
  // Popup animation values
  const [popupVisible, setPopupVisible] = useState(false);
  const popupScale = useSharedValue(0);
  const popupOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const maxBottomSheetHeight = parseFloat(
    Platform.OS === "ios"
      ? (0.55 * SCREEN_DIMENSIONS.height).toFixed(1)
      : (0.536 * SCREEN_DIMENSIONS.height).toFixed(1)
  );
  const { userLocation } = useContext(UserLocationContext);
  const [icon, setIcon] = useState<string | null>(null);

  useEffect(() => {
    const fetchIcon = async () => {
      setIcon(
        await getWeatherIcon(userLocation?.latitude, userLocation.longitude)
      );
      console.log("Weather Icon:", icon);
    };

    fetchIcon();
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => {
    // Fade out when above 40%
    const opacity = interpolate(
      bottomSheetPosition.value,
      [maxBottomSheetHeight - 150, maxBottomSheetHeight - 420], // Adjust range to smooth transition
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });
  return (
    <>
      {/* Info Button Container */}
      <Animated.View style={[styles.infoButtonContainer, animatedButtonStyle]}>
        <Image
          source={{ uri: `${icon}.png` }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  // Info Button and container
  infoButtonContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? SCREEN_DIMENSIONS.height * 0.06
        : SCREEN_DIMENSIONS.height * 0.05, // Account for status bar
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    right: 15,
    zIndex: 1000,
  },
});

export default WeatherButton;
