import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const FilterBottomSheet = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    isVisible && (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['50%', '75%']}
        backgroundStyle={{ backgroundColor: 'white' }}
        onClose={onClose}
      >
        <View style={styles.content}>
          <Text>Filter Options</Text>
          {/* Add your filter UI here */}
        </View>
      </BottomSheet>
    )
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