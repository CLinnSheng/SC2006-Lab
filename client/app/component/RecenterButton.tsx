// RecenterButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import SCREEN_DIMENSIONS from "../constants/screenDimension";
import { BlurView } from "expo-blur";

interface RecenterButtonProps {
  bottomSheetPosition: any;
  maxBottomSheetHeight: number;
  onPress: () => void;
}

const RecenterButton: React.FC<RecenterButtonProps> = ({
  bottomSheetPosition,
  maxBottomSheetHeight,
  onPress,
}) => {
  const animatedButtonStyle = useAnimatedStyle(() => {
    const translateY =
      bottomSheetPosition.value <= maxBottomSheetHeight
        ? 0
        : (bottomSheetPosition.value - maxBottomSheetHeight) * 1;

    const opacity = interpolate(
      bottomSheetPosition.value,
      [maxBottomSheetHeight, maxBottomSheetHeight - 100],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[animatedButtonStyle, styles.myLocationButtonContainer]}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={50}
          tint="light"
          style={styles.locationButtonBlurContainer}
        >
          <TouchableOpacity onPress={onPress} style={styles.buttonContent}>
            <Ionicons name="locate" size={24} color="#007AFF" />
          </TouchableOpacity>
        </BlurView>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.buttonContent, styles.androidButton]}
        >
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  myLocationButtonContainer: {
    position: "absolute",
    // backgroundColor: "#FFFFFF",
    // borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 5,
    right: 15,
    bottom:
      Platform.OS === "ios"
        ? SCREEN_DIMENSIONS.height * 0.462
        : SCREEN_DIMENSIONS.height * 0.445,
  },
  locationButtonBlurContainer: {
    overflow: "hidden",
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  androidButton: {
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
});

export default RecenterButton;
