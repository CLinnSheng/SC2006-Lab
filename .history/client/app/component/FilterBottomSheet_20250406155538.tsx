import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const FilterBottomSheet = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // Start in a closed state
      snapPoints={['50%', '75%']}
      backgroundStyle={{ backgroundColor: 'white' }}
      onClose={onClose}
    >
      <View style={styles.content}>
        <Text>Filter Options</Text>
        {/* Add your filter UI here */}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FilterBottomSheet;