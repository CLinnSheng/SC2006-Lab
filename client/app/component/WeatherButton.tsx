import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur"; // Import BlurView from expo-blur
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
import getWeatherForecast from "./hooks/get3HourWeather";

interface InfoButtonProps {
  bottomSheetPosition: Animated.SharedValue<number>;
}

interface ForecastItem {
  time: string;
  temperature: string;
  condition: string;
  iconUrl: string;
  isDaytime: boolean;
}

const WeatherButton: React.FC<InfoButtonProps> = ({ bottomSheetPosition }) => {
  // Popup animation values
  const [popupVisible, setPopupVisible] = useState(false);
  const popupScale = useSharedValue(0);
  const popupOpacity = useSharedValue(0);
  const maxBottomSheetHeight = parseFloat(
    Platform.OS === "ios"
      ? (0.55 * SCREEN_DIMENSIONS.height).toFixed(1)
      : (0.536 * SCREEN_DIMENSIONS.height).toFixed(1)
  );
  const { userLocation } = useContext(UserLocationContext);
  const [icon, setIcon] = useState<string | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const popupRef = useRef<View>(null);

  useEffect(() => {
    const fetchIcon = async () => {
      setIcon(
        await getWeatherIcon(userLocation?.latitude, userLocation?.longitude)
      );
    };

    fetchIcon();
  }, [userLocation]);

  // Fetch forecast data
  useEffect(() => {
    const fetchForecast = async () => {
      if (userLocation?.latitude && userLocation?.longitude) {
        try {
          const forecastData = await getWeatherForecast(
            userLocation.latitude,
            userLocation.longitude
          );
          
          if (forecastData && forecastData.forecastHours) {
            // Format each hour in a user-friendly way
            const processedForecast = forecastData.forecastHours.map((hour: any) => {
              // Use displayDateTime to format the time
              let hours = hour.displayDateTime?.hours || 0;
              let ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              hours = hours ? hours : 12; // Convert 0 to 12
              const formattedTime = `${hours}:00 ${ampm}`;
              
              // Get temperature
              const temp = hour.temperature?.degrees;
              const unit = hour.temperature?.unit === 'CELSIUS' ? '°C' : '°F';
              const temperature = temp !== undefined ? `${Math.round(temp)}${unit}` : 'N/A';
              
              // Get condition text
              const condition = hour.weatherCondition?.description?.text || 'Unknown';
              
              // Get icon URL
              let iconUrl = '';
              if (hour.weatherCondition?.iconBaseUri) {
                // For Google's weather API format
                iconUrl = `${hour.weatherCondition.iconBaseUri}.png`;
              } else if (icon) {
                // Fallback to current weather icon
                iconUrl = `${icon}.png`;
              }
              
              return {
                time: formattedTime,
                temperature: temperature,
                condition: condition,
                iconUrl: iconUrl,
                isDaytime: hour.isDaytime || false
              };
            });
            
            setForecast(processedForecast);
          }
        } catch (error) {
          console.error("Error processing forecast data:", error);
        }
      }
    };

    fetchForecast();
  }, [userLocation, icon]);

  // Handle opening and closing the popup
  const openPopup = () => {
    setPopupVisible(true);
    popupScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    popupOpacity.value = withTiming(1, { duration: 300 });
  };

  const closePopup = () => {
    popupOpacity.value = withTiming(0, { duration: 200 });
    popupScale.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setPopupVisible)(false);
    });
  };

  const togglePopup = () => {
    if (popupVisible) {
      closePopup();
    } else {
      openPopup();
    }
  };

  // Close popup when touched outside
  const handleOutsideTouch = () => {
    if (popupVisible) {
      closePopup();
    }
  };

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

  const animatedPopupStyle = useAnimatedStyle(() => {
    return {
      opacity: popupOpacity.value,
      transform: [{ scale: popupScale.value }],
      display: popupOpacity.value === 0 ? "none" : "flex",
    };
  });

  // Format the date for the header
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Create button with appropriate blur effect based on platform
  const renderButton = () => {
    // On iOS we can use BlurView for a nice effect
    if (Platform.OS === 'ios') {
      return (
        <BlurView intensity={50} tint="light" style={styles.buttonBlurContainer}>
          <TouchableOpacity onPress={togglePopup} style={styles.buttonContent}>
            <Image
              source={{ uri: `${icon}.png` }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </BlurView>
      );
    }
    
    // On Android, we use a semi-transparent background
    return (
      <TouchableOpacity 
        onPress={togglePopup} 
        style={[styles.buttonContent, styles.androidButton]}
      >
        <Image
          source={{ uri: `${icon}.png` }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Overlay to capture touches outside the popup */}
      {popupVisible && (
        <TouchableWithoutFeedback onPress={handleOutsideTouch}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      
      {/* Info Button Container */}
      <Animated.View style={[styles.infoButtonContainer, animatedButtonStyle]}>
        {renderButton()}

        {/* Weather Forecast Popup */}
        {popupVisible && (
          <TouchableWithoutFeedback>
            <Animated.View 
              ref={popupRef}
              style={[styles.forecastPopup, animatedPopupStyle]}
            >
              <Text style={styles.forecastTitle}>
                3-Hour Forecast
                
              </Text><Text style={styles.forecastDate}> ({formatDate()})</Text>
              
              {forecast.length > 0 ? (
                <View style={styles.forecastList}>
                  {forecast.map((item, index) => (
                    <View key={index} style={styles.forecastItem}>
                      <Text style={styles.forecastTime}>{item.time}</Text>
                      <Image 
                        source={{ uri: item.iconUrl }} 
                        style={styles.forecastIcon} 
                        resizeMode="contain"
                      />
                      <View style={styles.forecastInfoContainer}>
                        <Text style={styles.forecastTemp}>{item.temperature}</Text>
                        <Text style={styles.forecastDesc}>{item.condition}</Text>
                        <Text style={styles.forecastDaynight}>
                          {item.isDaytime ? "Day" : "Night"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.loadingContainer}>
                  <Text>Loading forecast...</Text>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  // Info Button and container
  infoButtonContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? SCREEN_DIMENSIONS.height * 0.06
        : SCREEN_DIMENSIONS.height * 0.05, 
    right: 15,
    zIndex: 1000,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonBlurContainer: {
    overflow: 'hidden',
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
    backgroundColor: 'rgba(255, 255, 255, 0.75)', 
  },
  forecastPopup: {
    position: "absolute",
    top: 60,
    right: 0,
    width: 280,
    backgroundColor: "#FFFFFF", 
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 1001,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  forecastDate: {
    fontWeight: "400",
    fontSize: 14,
    color: "#666",
    textAlign: "center",

  },
  forecastList: {
    width: "100%",
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  forecastTime: {
    width: 70,
    fontSize: 14,
    color: "#333",
  },
  forecastIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  forecastInfoContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 5,
  },
  forecastTemp: {
    fontSize: 15,
    fontWeight: "600",
  },
  forecastDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  forecastDaynight: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  loadingContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WeatherButton;