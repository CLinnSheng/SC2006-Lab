import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';

type FilterProps = {
  isVisible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const Filter = ({ isVisible = false, onOpen, onClose }: FilterProps) => {
  // Ref for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Effect to expand/collapse the bottom sheet based on visibility state
  useEffect(() => {
    if (isVisible) {
      // Use snapToIndex instead of expand, specify which snap point (0 or 1)
      bottomSheetRef.current?.snapToIndex(1); // Use index 1 (75%) for maximum height
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Handler for button press
  const handleFilterPress = () => {
    console.log('Filter button pressed');
    if (onOpen) {
      onOpen();
    }
  };

  // Handler for closing the bottom sheet
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
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
        snapPoints={'13%', '75%']}
        backgroundStyle={{ backgroundColor: 'white' }}
        onClose={handleClose}
        enablePanDownToClose={true} // Ensure users can close by dragging down
      >
        <View style={styles.content}>
          <Text style={styles.title}>Filter Options</Text>
          {/* Add your filter UI here */}
          <Text style={styles.option}>Price Range</Text>
          <Text style={styles.option}>Distance</Text>
          <Text style={styles.option}>Availability</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
});

export default Filter;