import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import SCREEN_DIMENSIONS from "../constants/screenDimension";

interface InfoButtonProps {
  // Optional props with default values i
}

const WeatherButton: React.FC<InfoButtonProps> = ({ 
}) => {
  // Popup animation values
  const [popupVisible, setPopupVisible] = useState(false);
  const popupScale = useSharedValue(0);
  const popupOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const toggleInfoPopup = () => {
    if (!popupVisible) {
      // Show popup
      setPopupVisible(true);
      popupScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      popupOpacity.value = withTiming(1, { duration: 300 });
      overlayOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Hide popup
      popupScale.value = withTiming(0, { duration: 250 });
      popupOpacity.value = withTiming(0, { duration: 250 });
      overlayOpacity.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(setPopupVisible)(false);
      });
    }
  };

  // Animated styles for popup
  const animatedPopupStyle = useAnimatedStyle(() => {
    return {
      opacity: popupOpacity.value,
      transform: [
        { scale: popupScale.value },
      ],
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  return (
    <>
      {/* Animated overlay */}
      {popupVisible && (
        <Animated.View 
          style={[styles.overlay, animatedOverlayStyle]} 
          pointerEvents={popupVisible ? "auto" : "none"}
          onTouchStart={toggleInfoPopup}
        />
      )}
      
      {/* Info Button Container */}
      <View style={styles.infoButtonContainer}>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={toggleInfoPopup}
          accessibilityLabel="Information button"
          accessibilityHint="Opens information about car park locations"
        >
          <Ionicons name="cloud-outline" size={24} color="#000" />
        </TouchableOpacity>
        
        {/* Popup that animates from the info button */}
        {popupVisible && (
          <Animated.View style={[styles.popupContainer, animatedPopupStyle]}>
            <Text style={styles.popupTitle}>Current Weather Forecast</Text>
            <View style={styles.popupContent}>
  <Ionicons name="rainy-outline" size={80} color="blue" />
  <Text style={styles.popupText}>Showers</Text>
  <Text style={styles.advisory}>It's about to rain...{'\n'}Please Drive Safely.</Text>
  </View>
          </Animated.View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Info Button and container
  infoButtonContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 40, // Account for status bar
    right: 15,
    alignItems: "flex-end",
    zIndex: 1000,
  },
  infoButton: {
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
  },
  // Overlay for popup
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  // Popup styles
  popupContainer: {
    position: "absolute",
    top: 60, // Position below the info button
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    transformOrigin: "top right",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    alignSelf: "center",
    marginLeft:10,
  },
  popupText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
    lineHeight: 22,
    alignSelf: "center",
  },
  advisory: {
    fontSize: 16,
    marginBottom: 2,
    color: "#444",
    lineHeight: 22,
    alignSelf: "auto",
  },
  popupContent: {
    flexDirection: 'column', // stack vertically
    alignItems: 'center', // center both icon and text horizontally
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default WeatherButton;