import React, { useRef, useEffect, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

type FilterProps = {
  isVisible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const Filter = ({ isVisible = false, onOpen, onClose }: FilterProps) => {
  // Ref for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points for the bottom sheet
  const snapPoints = ['50%', '75%'];

  // Effect to expand/collapse the bottom sheet based on visibility state
  useEffect(() => {
    console.log('Filter isVisible changed:', isVisible);
    if (isVisible) {
      bottomSheetRef.current?.snapToIndex(0); // Use index 0 (50%) for initial view
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
    console.log('Filter sheet closed');
    if (onClose) {
      onClose();
    }
  };

  // Backdrop component with proper typing
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <View style={{ zIndex: 5000 }}>
      {/* Filter Button */}
      <TouchableOpacity style={styles.button} onPress={handleFilterPress}>
        <MaterialIcons name="filter-list" size={24} color="white" />
        <Text style={styles.buttonText}>Filter</Text>
      </TouchableOpacity>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={isVisible ? 0 : -1} // Directly control the index based on isVisible
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        onClose={handleClose}
        enablePanDownToClose={true}
        handleStyle={{ backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        handleIndicatorStyle={{ backgroundColor: '#999', width: 50 }}
        backdropComponent={renderBackdrop}
        enableOverDrag={true}
        enableHandlePanningGesture={true}
        style={styles.bottomSheet}
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
  bottomSheet: {
    zIndex: 5000,
    elevation: 5000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
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