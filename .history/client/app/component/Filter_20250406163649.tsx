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
      bottomSheetRef.current?.expand();
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