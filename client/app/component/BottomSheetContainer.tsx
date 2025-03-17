import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SharedValue, useSharedValue } from "react-native-reanimated";

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
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Search Maps"
          // onPress={handlePlaceSelected}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
            language: "en",
          }}
        />
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
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//   },
//   bottomSheetBackground: {
//     backgroundColor: "#F5F5F7",
//   },
//   scrollViewContent: {
//     paddingBottom: 20,
//   },
//   indicator: {
//     width: 40,
//     height: 4,
//     backgroundColor: "#CCCCCC",
//     alignSelf: "center",
//   },
//   collapsedSearchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 16,
//     marginTop: 12,
//     marginBottom: 8,
//     padding: 12,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginLeft: 5,
//     marginRight: 8,
//   },
//   searchPlaceholder: {
//     fontSize: 16,
//     color: "#999",
//   },
//   expandedSearchContainer: {
//     marginHorizontal: 16,
//     marginTop: 12,
//     marginBottom: 8,
//     borderRadius: 10,
//     overflow: "visible",
//     zIndex: 5,
//   },
//   autocompleteContainer: {
//     flex: 0,
//     width: "100%",
//     zIndex: 1,
//   },
// 	input: {
// 		marginTop: 8,
// 		marginHorizontal: 16,
// 		marginBottom: 10,
// 		borderRadius: 10,
// 		fontSize: 16,
// 		lineHeight: 20,
// 		padding: 8,
// 		backgroundColor: 'rgba(151, 151, 151, 0.25)',
// 		color: '#fff'
// 	},
//   listView: {
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     marginTop: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   row: {
//     padding: 13,
//     backgroundColor: "#fff",
//   },
//   description: {
//     fontSize: 14,
//   },
//   recentSearchesContainer: {
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 16,
//     marginTop: 16,
//     padding: 16,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 12,
//     color: "#333",
//   },
//   recentSearchItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#EEEEEE",
//   },
//   recentIcon: {
//     marginRight: 10,
//   },
//   recentSearchText: {
//     fontSize: 16,
//     color: "#333",
//   },
// });

export default BottomSheetContainer;
