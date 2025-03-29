import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator, StyleSheet, Dimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

const { width, height } = Dimensions.get("window");

const LoadFonts = async () => {
  await Font.loadAsync({
    ArialRoundedBold: require("../../assets/fonts/ArialRoundedBold.ttf"),
  });
};

const LaunchScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [textAnim] = useState(new Animated.Value(0));
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    LoadFonts().then(() => setFontLoaded(true));

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(textAnim, {
      toValue: 1,
      duration: 2500,
      delay: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={["#40E0D0", "#000000"]} style={styles.container}>
      <Animated.Image 
        source={require("../../assets/logo.png")} 
        style={[styles.logo, { opacity: fadeAnim }]} 
        resizeMode="contain"
      />
      <Animated.Text style={[styles.text, { opacity: textAnim }]}>SWEETSPOT</Animated.Text>
      <ActivityIndicator size="large" color="#007AFF" />
    </LinearGradient>
  );
};

export default LaunchScreen;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 40,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "ArialRoundedBold",
  },
});