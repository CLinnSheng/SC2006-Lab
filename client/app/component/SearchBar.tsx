import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values'

// In SearchBar.tsx (renamed from GooglePlacesInput.tsx)
const SearchBar = () => {  
    return (
      <GooglePlacesAutocomplete
      placeholder='Search'
      fetchDetails={true}
      enablePoweredByContainer={false}
      onPress={(data, details = null) => {
        console.log(JSON.stringify(data))
        console.log(JSON.stringify(details?.geometry.location))
      }}
      styles={{
        container: {
        position: 'absolute',
        top: 70,
        width: '95%',
        alignSelf: 'center',
        zIndex: 1,
        },
        textInput: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 17,
        },
      }}
      query={{
        key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        language: 'en',
      }}
      />
    );
  };
  
  export default SearchBar;  // Correct export