import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Filter = () => {
  const [vehicleType, setVehicleType] = useState(''); // Ensure initial state is ''
  const [range, setRange] = useState(''); // Ensure initial state is ''
  const [isEV, setIsEV] = useState(false);

  return (
    <View style={styles.container}>
      {/* Vehicle Type Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={vehicleType}
            onValueChange={(itemValue) => {
              console.log(itemValue); // Debugging: See the selected value
              setVehicleType(itemValue); // Make sure state updates correctly
            }}
            style={styles.picker}
          >
            {/* Default item value should be '' */}
            <Picker.Item label="Select Vehicle" value="" />
            <Picker.Item label="Car" value="car" />
            <Picker.Item label="Bike" value="bike" />
            <Picker.Item label="Truck" value="truck" />
          </Picker>
        </View>
      </View>

      {/* Range Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Range (in km)</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={range}
            onValueChange={(itemValue) => {
              console.log(itemValue); // Debugging: See the selected value
              setRange(itemValue); // Ensure range state updates correctly
            }}
            style={styles.picker}
          >
            {/* Default item value should be '' */}
            <Picker.Item label="Select Range" value="" />
            <Picker.Item label="50 km" value="50" />
            <Picker.Item label="100 km" value="100" />
            <Picker.Item label="150 km" value="150" />
            <Picker.Item label="200 km" value="200" />
          </Picker>
        </View>
      </View>

      {/* EV Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>EV (Electric Vehicle)</Text>
        <Switch
          value={isEV}
          onValueChange={setIsEV}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEV ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 12,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    height:120,
    width: '100%',
    marginTop: -40, // Adjust this value to push the picker up


  },
  switchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Filter;
