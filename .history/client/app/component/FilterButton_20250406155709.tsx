import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import FilterBottomSheet from './FilterBottomSheet';



const FilterButton = () => {
    const [isFilterVisible, setFilterVisible] = useState(false);

    const handlePress = () => {
        console.log('Filter button pressed');
        setFilterVisible(true);
    };

    const handleClose = () => {
        setFilterVisible(false);
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