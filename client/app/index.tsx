import { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import loadFonts from "./utils/LoadFonts"; // Path to your font loader utility

export default function Index() {
  // useEffect(() => {
  //   const loadAppFonts = async () => {
  //     try {
  //       loadFonts(); // Load fonts
  //     } catch (error) {
  //       console.error("Error loading fonts", error);
  //     }
  //   };
  //   loadAppFonts();
  // }, []);

  // Once fonts are loaded, redirect to the Launch screen
  return <Redirect href="/launch" />;
}
