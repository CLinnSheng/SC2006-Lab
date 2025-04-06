import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import FilterBottomSheet from './FilterBottomSheet';

interface FilterButtonProps {
    onPress: () => void;
  }

const FilterButton = () => {
const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name="filter-list" size={24} color="white" />
      <Text style={styles.buttonText}>Filter</Text>
    </TouchableOpacity>
  );
};

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <MaterialIcons name="filter-list" size={24} color="white" />
                <Text style={styles.buttonText}>Filter</Text>
            </TouchableOpacity>

            <FilterBottomSheet isVisible={isFilterVisible} onClose={handleClose} />
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
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default FilterButton;