import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  ActivityIndicator,
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
      onExitSearch,
    }: {
      onFocusExpand: () => void;
      onCancelPress: () => void;
      onFoucs: () => void;
      onBlur: () => void;
      searchedLocation: (location: any) => void;
      onExitSearch: () => void;
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const autoCompleteRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      clearInput: () => {
        setInputValue("");
        autoCompleteRef.current?.setAddressText("");
        console.log("Input cleared");
      },
    }));

    // Pre-focus optimization
    useEffect(() => {
      // Pre-initialize GooglePlacesAutocomplete when component mounts
      return () => {
        // Cleanup any resources on unmount
      };
    }, []);

    const handleFocus = () => {
      console.log("Search bar focused");
      // Set focused state first for immediate visual feedback
      setIsFocused(true);
      // Then trigger expanded UI
      requestAnimationFrame(() => {
        onFocusExpand();
        onFoucs();
      });
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
      Keyboard.dismiss();
      setIsFocused(false);
      requestAnimationFrame(() => {
        onCancelPress();
        onExitSearch();
      });
    };

    const handleClearPress = () => {
      setInputValue("");
      if (autoCompleteRef.current) {
        autoCompleteRef.current.setAddressText("");
      }
      console.log("X pressed");
    };

    const handleSearchPress = (data: any, details: any = null) => {
      setIsLoading(true);
      searchedLocation(details?.geometry.location);
      // Small delay to allow location processing before closing
      setTimeout(() => {
        onCancelPress();
        setIsLoading(false);
      }, 300);
    };

    return (
      <View style={styles.searchBarContainer}>
        <Pressable 
          style={styles.searchBarTouchable}
          onPress={() => {
            if (!isFocused) {
              autoCompleteRef.current?.focus();
            }
          }}
          android_ripple={{ color: '#e0e0e0', borderless: true }}
        >
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
            onPress={handleSearchPress}
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
              row: styles.row,
              separator: styles.separator,
              description: { fontSize: 14 }, // Making text easier to tap
              predefinedPlacesDescription: { fontSize: 14 },
            }}
            debounce={300} // Add debounce to reduce API calls and improve responsiveness
          />

          {/* Loading indicator */}
          {isLoading && (
            <ActivityIndicator 
              style={styles.loadingIndicator} 
              size="small" 
              color="#007AFF" 
            />
          )}

          {/*Cancel button*/}
          {isFocused && (
            <TouchableOpacity
              onPress={handleCancelPress}
              style={styles.cancelButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {/* 'X' Button */}
          {inputValue.length > 0 && isFocused && (
            <TouchableOpacity
              onPress={handleClearPress}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          )}

          {/* Exit Button */}
          {inputValue.length > 0 && !isFocused && (
            <TouchableOpacity 
              onPress={onExitSearch} 
              style={styles.exitButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          )}
        </Pressable>
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
    zIndex: 5,
  },
  searchBarTouchable: {
    position: "relative",
    width: "100%",
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
    elevation: 2, // Add some elevation for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cancelButton: {
    position: "absolute",
    right: -44,
    top: 30,
    zIndex: 10,
    padding: 5, // Increase touch target
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
    padding: 5, // Increase touch target
  },
  listView: {
    width: "116%",
    marginTop: 10,
    backgroundColor: "#FFFFFF", // Ensure consistent background
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: {
    backgroundColor: "transparent",
    paddingHorizontal: 7,
    paddingVertical: 10, // Increase touch target height
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "150%",
  },
  exitButton: {
    position: "absolute",
    right: -25,
    top: 30,
    zIndex: 10,
    padding: 5, // Increase touch target
  },
  loadingIndicator: {
    position: "absolute",
    right: 20,
    top: 30,
    zIndex: 10,
  },
});

export default GoogleSearchBar;
