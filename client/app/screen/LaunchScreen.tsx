import React, { useEffect, useState } from "react";
import { StyleSheet, Animated, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LaunchScreen({
  onAnimationComplete,
}: {
  onAnimationComplete?: () => void;
}) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [textAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onAnimationComplete && onAnimationComplete();
      }
    });
  }, []);

  return (
    <LinearGradient colors={["#40E0D0", "#000000"]} style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Animated.Image
        source={require("../../assets/logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.text, { opacity: textAnim }]}>
        SWEETSPOT
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
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
