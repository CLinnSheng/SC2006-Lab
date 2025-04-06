import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const FilterButton = () => {
  const [isSecondSheetVisible, setSecondSheetVisible] = useState(false);

  const openSecondSheet = useCallback(() => {
    setSecondSheetVisible(true);
  }, []);

  const closeSecondSheet = useCallback(() => {
    setSecondSheetVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* First Bottom Sheet */}

      {/* Second Bottom Sheet */}
      {isSecondSheetVisible && (
        <BottomSheet snapPoints={['50%', '75%']} index={0} onClose={closeSecondSheet}>
          <View style={styles.sheetContent}>
            <Text>Filter Options</Text>
            {/* Add filtering options here */}
            <Button title="Close" onPress={closeSecondSheet} />
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FilterButton;