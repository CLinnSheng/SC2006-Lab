import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import GoogleSearchBar from "./SearchBar";

const { width } = Dimensions.get("window");

const BottomSheetContainer = ({
  mapRef,
  bottomSheetPosition,
}: {
  mapRef: React.RefObject<any>,
  bottomSheetPosition: SharedValue<number>;
}) => {
  const bottomSheetRef = useRef(null);
  const googlePlacesRef = useRef(null);

  // State
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const snapPoints = useMemo(() => ["10%", "40%", "93%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={{ backgroundColor: "#F5F5F7" }}
      enablePanDownToClose={false}
      enableOverDrag={false}
      animatedPosition={bottomSheetPosition}
    >
      <BottomSheetView>
        {/* <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Search Maps"
          // onPress={handlePlaceSelected}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
            language: "en",
          }}
        /> */}
        <GoogleSearchBar />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: "#CCCCCC",
    alignSelf: "center",
  },
});

export default BottomSheetContainer;
