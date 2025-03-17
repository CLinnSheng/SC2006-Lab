import React, { useEffect, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// In SearchBar.tsx (renamed from GooglePlacesInput.tsx)
const GoogleSearchBar = () => {
  return (

    <View style={styles.searchBarContainer}>
      <Ionicons
        name="search"
        size={20}
        color="#888"
        style={styles.searchIcon}
      />
      <GooglePlacesAutocomplete
        placeholder="Search Maps"
        onPress={(data) => console.log(data)}
        textInputProps={{
          onFocus: () => console.log("Search bar focused"),
          placeholderTextColor: "grey"
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
        }}
        enablePoweredByContainer={false}
        styles={{
          textInput: styles.searchInput,
          textInputContainer: styles.inputContainer,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: "absolute",
    width: "90%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    paddingHorizontal: 10, // Inner padding
    top: -20, // Place below status bar
  },
  searchIcon: {
    position: "relative",
    left: 8, // Align inside input
    top: 41,
    transform: [{ translateY: -10 }], // Center vertically
    zIndex: 1, // Place icon on top
    pointerEvents: "none" // Allow touches to pass through
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingLeft: 35, // Space for typing
    fontSize: 15,
    color: "#333",
  },
});
export default GoogleSearchBar;
// return (
//   <View>
//     <GooglePlacesAutocomplete
//       placeholder="Search"
//       fetchDetails={true}
//       enablePoweredByContainer={false}
//       onPress={(data, details = null) => {
//         console.log(JSON.stringify(data));
//         console.log(JSON.stringify(details?.geometry.location));
//       }}
//       styles={{
//         container: {
//           position: "absolute",
//           top: 70,
//           width: "95%",
//           alignSelf: "center",
//           zIndex: 1,
//         },
//         textInput: {
//           backgroundColor: "white",
//           borderRadius: 20,
//           paddingHorizontal: 17,
//         },
//       }}
//       query={{
//         key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
//         language: "en",
//       }}
//     />
//   </View>
// );
