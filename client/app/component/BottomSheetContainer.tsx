import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width } = Dimensions.get('window');

const BottomSheetContainer = ({ mapRef }) => {
  const bottomSheetRef = useRef(null);
  const googlePlacesRef = useRef(null);

  // State
  const [expanded, setExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const initialSnapPoints = useMemo(() => ['13%', '40%', '92%'], []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    setExpanded(index > 0);
  }, []);

  const handlePlaceSelected = (data, details = null) => {
    if (details && details.geometry) {
      const { location } = details.geometry;

      mapRef.current?.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );

      bottomSheetRef.current?.snapToIndex(0);
      if (googlePlacesRef.current) {
        googlePlacesRef.current.clear();
      }
      setIsSearchFocused(false);
    }
  };

  const expandBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
    setIsSearchFocused(true);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={initialSnapPoints}
      onChange={handleSheetChanges}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetScrollView contentContainerStyle={styles.scrollViewContent}>
        {!expanded && (
          <TouchableOpacity
            style={styles.collapsedSearchBar}
            onPress={expandBottomSheet}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search for a place or address</Text>
          </TouchableOpacity>
        )}

        {expanded && (
          <View style={styles.expandedSearchContainer}>
            <GooglePlacesAutocomplete
              ref={googlePlacesRef}
              placeholder="Search for a place or address"
              onPress={handlePlaceSelected}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
                language: 'en',
              }}
              fetchDetails={true}
              enablePoweredByContainer={false}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.input,
                listView: styles.listView,
                row: styles.row,
                description: styles.description,
              }}
              textInputProps={{
                clearButtonMode: 'while-editing',
                placeholderTextColor: '#999',
                autoFocus: true,
                onFocus: () => setIsSearchFocused(true),
                onChangeText: (text) => {
                  if (text.length > 0) {
                    setIsSearchFocused(false); // Hide recent searches when typing
                  }
                },
              }}
              renderLeftButton={() => (
                <View style={styles.searchIcon}>
                  <Ionicons name="search" size={20} color="#999" />
                </View>
              )}
              debounce={300}
              minLength={2}
            />
          </View>
        )}

        {/* {expanded && isSearchFocused && (
          <View style={styles.recentSearchesContainer}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentSearchItem}>
              <Ionicons name="time-outline" size={20} color="#999" style={styles.recentIcon} />
              <Text style={styles.recentSearchText}>Work</Text>
            </View>
            <View style={styles.recentSearchItem}>
              <Ionicons name="time-outline" size={20} color="#999" style={styles.recentIcon} />
              <Text style={styles.recentSearchText}>Home</Text>
            </View>
          </View>
        )} */}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#F5F5F7',
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
  },
  collapsedSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginLeft: 5,
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  expandedSearchContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'visible',
    zIndex: 5,
  },
  autocompleteContainer: {
    flex: 0,
    width: '100%',
    zIndex: 1,
  },
  input: {
    height: 44,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 35,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    padding: 13,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 14,
  },
  recentSearchesContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  recentIcon: {
    marginRight: 10,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BottomSheetContainer;
