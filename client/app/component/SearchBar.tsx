import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values'

// In SearchBar.tsx (renamed from GooglePlacesInput.tsx)
const SearchBar = () => {  // Rename the component
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        styles={{
          container: {
            position: 'absolute',
            top: 40,
            width: '90%',
            alignSelf: 'center',
            zIndex: 1,
          },
          textInput: {
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 20,
          },
        }}
        query={{
          key: 'AIzaSyCcHMugv8qXNg10Fi9H5fCCnZkqQWH_DiM',
          language: 'en',
        }}
      />
    );
  };
  
  export default SearchBar;  // Correct export