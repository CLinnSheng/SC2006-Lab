import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type FilterProps = {
  onPress: () => void;
}

const Filter = ({ onPress }: FilterProps) => {
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
    
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  }
});

export default Filter;