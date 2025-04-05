import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Animated, StatusBar, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

export default function LaunchScreen({
  onAnimationComplete,
}: {
  onAnimationComplete?: () => void;
}) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [textAnim] = useState(new Animated.Value(0));
  const carAnim = useRef(new Animated.Value(-200)).current; // Off-screen start

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
      Animated.timing(carAnim, {
        toValue: 0,
        duration: 2000,
        delay: 500,
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
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ translateX: carAnim }],
          },
        ]}
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
