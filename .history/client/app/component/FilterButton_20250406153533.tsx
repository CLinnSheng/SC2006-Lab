import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';

const FilterButton = () => {
    const filterBottomSheetRef = useRef<BottomSheet>(null);
    const filterBottomSheetPosition = useSharedValue(0);

    const handlePress = () => {
        console.log('Filter button pressed');
        filterBottomSheetRef.current?.expand();
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
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