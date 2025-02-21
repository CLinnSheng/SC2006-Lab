import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values'
import Config from 'react-native-config';

// In SearchBar.tsx (renamed from GooglePlacesInput.tsx)
const SearchBar = () => {  
    console.log(Config.GOOGLE_API_KEY);
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
          key: '',
          language: 'en',
        }}
      />
    );
  };
  
  export default SearchBar;  // Correct export