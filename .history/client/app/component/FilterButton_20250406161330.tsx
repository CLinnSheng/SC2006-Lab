import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FilterButtonProps {
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {

    const handlePress = () => {
        console.log('Filter button pressed'); // Log when the button is pressed
        onPress(); // Call the passed onPress function
      };
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default FilterButton;