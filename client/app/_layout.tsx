import { Stack } from "expo-router";
import UserLocationProvider from "./context/userLocation";
import loadFonts from "./utils/LoadFonts";
import React, { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts();
      } catch (error) {
        console.error("Error loading fonts", error);
      }
    };

    loadAppFonts();
  }, []);

  return (
    <UserLocationProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="launch"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="home"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
    </UserLocationProvider>
  );
}
