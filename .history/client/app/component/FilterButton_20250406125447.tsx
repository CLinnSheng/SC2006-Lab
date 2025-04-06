import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FilterButton = () => {
    const handlePress = () => {
        console.log('Filter button pressed');
      };
  
    return (
    <TouchableOpacity style={styles.button}>
      <MaterialIcons name="filter-list" size={24} color="white" />
      <Text style={styles.buttonText}>Filter</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default FilterButton;