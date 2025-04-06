import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FilterBottomSheet from './FilterBottomSheet';

interface FilterButtonProps {
    onPress: () => void; // Ensure this prop is defined
  }

  const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialIcons name="filter-list" size={24} color="white" />
        <Text style={styles.buttonText}>Filter</Text>
      </TouchableOpacity>
    );
  };
  

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={openFilterSheet}>
        <MaterialIcons name="filter-list" size={24} color="white" />
        <Text style={styles.buttonText}>Filter</Text>
      </TouchableOpacity>

      {/* Render the Filter Bottom Sheet */}
      <FilterBottomSheet isVisible={isFilterSheetVisible} onClose={closeFilterSheet} />
    </>
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
});

export default FilterButton;