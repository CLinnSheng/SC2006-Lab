import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import SCREEN_DIMENSIONS from "../constants/screenDimension";

const GoogleSearchBar = forwardRef(
  (
    {
      onFocusExpand,
      onCancelPress,
      onFoucs,
      onBlur,
      searchedLocation,
    }: {
      onFocusExpand: () => void;
      onCancelPress: () => void;
      onFoucs: () => void;
      onBlur: () => void;
      searchedLocation: (location: any) => void;
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const autoCompleteRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      clearInput: () => {
        setInputValue("");
        autoCompleteRef.current?.setAddressText("");
        console.log("Input cleared");
      },
    }));

    const handleFocus = () => {
      console.log("Search bar focused");
      onFocusExpand();
      setIsFocused(true);
      onFoucs();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur();
    };

    const handleCancelPress = () => {
      setInputValue("");
      if (autoCompleteRef.current) {
        autoCompleteRef.current.setAddressText("");
      }
      console.log("Cancel pressed");
      onCancelPress();
      Keyboard.dismiss();
      setIsFocused(false);
    };

    const handleClearPress = () => {
      setInputValue("");
      if (autoCompleteRef.current) {
        autoCompleteRef.current.setAddressText("");
      }
      console.log("X pressed");
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
          minLength={2}
          fetchDetails={true}
          placeholder="Search Maps"
          onPress={(data, details = null) => {
            searchedLocation(details?.geometry.location);
            onCancelPress();
          }}
          textInputProps={{
            onFocus: handleFocus,
            onBlur: handleBlur,
            onChangeText: setInputValue,
            value: inputValue,
            placeholderTextColor: "grey",
            clearButtonMode: "never",
            scrollEnabled: true,
          }}
          listViewDisplayed="auto"
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
            language: "en",
          }}
          enablePoweredByContainer={false}
          styles={{
            textInput: styles.searchInput,
            listView: styles.listView,
            row: styles.row, // Customize each dropdown item
            separator: styles.separator,
          }}
        />

        {/*Clear button*/}
        {isFocused && (
          <TouchableOpacity
            onPress={handleCancelPress}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {/* 'X' Button */}
        {inputValue.length > 0  && isFocused && (
          <TouchableOpacity
            onPress={handleClearPress}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#A0A0A0" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  searchBarContainer: {
    position: "absolute",
    width: SCREEN_DIMENSIONS.width * 0.86,
    paddingHorizontal: 10,
    top: -20,
    left: 2,
  },
  searchIcon: {
    position: "relative",
    left: 8,
    top: 30,
    zIndex: 5,
    pointerEvents: "none", // Allow touches to pass through
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFF",
    borderRadius: 11,
    paddingLeft: 35,
    fontSize: 15,
    color: "#333",
    overflow: "hidden",
    paddingRight: 35,
  },
  cancelButton: {
    position: "absolute",
    right: -44,
    top: 30,
    zIndex: 3,
  },
  cancelText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
  clearButton: {
    position: "absolute",
    right: 20,
    top: 30,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  listView: {
    width: "116%",
    marginTop: 10,
  },
  row: {
    backgroundColor: "transparent", // Remove white background for each row
    paddingHorizontal: 7,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "150%",
  },
});
export default GoogleSearchBar;
