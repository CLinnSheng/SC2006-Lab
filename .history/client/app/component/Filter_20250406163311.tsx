import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';

const Filter = () => {
  // State to manage filter sheet visibility
  const [isFilterVisible, setFilterVisible] = useState(false);
  
  // Ref for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Effect to expand/collapse the bottom sheet based on visibility state
  useEffect(() => {
    if (isFilterVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isFilterVisible]);

  // Handler for button press
  const handleFilterPress = () => {
    console.log('Filter button pressed');
    setFilterVisible(true);
  };

  // Handler for closing the bottom sheet
  const handleClose = () => {
    setFilterVisible(false);
  };

  return (
    <View>
      {/* Filter Button */}
      <TouchableOpacity style={styles.button} onPress={handleFilterPress}>
        <MaterialIcons name="filter-list" size={24} color="white" />
        <Text style={styles.buttonText}>Filter</Text>
      </TouchableOpacity>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Start in a closed state
        snapPoints={['50%', '75%']}
        backgroundStyle={{ backgroundColor: 'white' }}
        onClose={handleClose}
      >
        <View style={styles.content}>
          <Text>Filter Options</Text>
          {/* Add your filter UI here */}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Filter;