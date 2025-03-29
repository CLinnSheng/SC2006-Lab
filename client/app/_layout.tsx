import { Stack } from "expo-router";
import UserLocationProvider from "./context/userLocation";
import loadFonts from "./utils/LoadFonts";
import React, { useEffect, useState } from "react";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts(); // Load fonts
        setFontsLoaded(true); // Set state once loaded
      } catch (error) {
        console.error("Error loading fonts", error);
      }
    };

    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Do not render anything until fonts are loaded
  }

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
