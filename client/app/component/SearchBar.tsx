import React, { useRef, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// In SearchBar.tsx (renamed from GooglePlacesInput.tsx)
const GoogleSearchBar = ({
  onFocusExpand,
  onCancelPress,
}: {
  onFocusExpand: () => void;
  onCancelPress: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const autoCompleteRef = useRef<any>(null);

  const handleFocus = () => {
    console.log("Search bar focused");
    onFocusExpand(); // Trigger bottom sheet expansion to 93%
  };

  const handleCancelPress = () => {
    setInputValue("");
    if (autoCompleteRef.current) {
      autoCompleteRef.current.setAddressText("");
    }
    console.log("Cancel pressed");
    onCancelPress(); // Trigger bottom sheet collapse to 40%
    Keyboard.dismiss();
  };

  return (
    <View style={styles.searchBarContainer}>
      <Ionicons
        name="search"
        size={20}
        color="#888"
        style={styles.searchIcon}
      />
      <GooglePlacesAutocomplete
        ref={autoCompleteRef}
        placeholder="Search Maps"
        onPress={(data) => console.log(data)}
        textInputProps={{
          onFocus: handleFocus,
          placeholderTextColor: "grey",
          onChangeText: setInputValue,
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
        }}
        enablePoweredByContainer={false}
        styles={{
          textInput: styles.searchInput,
        }}
      />
      {inputValue.length > 0 && (
        <TouchableOpacity
          onPress={handleCancelPress}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: "absolute",
    width: "86%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    paddingHorizontal: 10, // Inner padding
    top: -20, // Place below status bar
    left: 7, // Move to the right
  },
  searchIcon: {
    position: "relative",
    left: 8, // Align inside input
    top: 41,
    transform: [{ translateY: -10 }], // Center vertically
    zIndex: 1, // Place icon on top
    pointerEvents: "none", // Allow touches to pass through
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFF",
    borderRadius: 11,
    paddingLeft: 35,
    fontSize: 15,
    color: "#333",
  },
  cancelButton: {
    position: "absolute",
    right: -44,
    top: 30,
  },
  cancelText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
});
export default GoogleSearchBar;
