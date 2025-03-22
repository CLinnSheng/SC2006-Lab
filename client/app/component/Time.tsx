import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface TimePickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  return (
    <View style={styles.timeSelectors}>
      <View style={styles.timeSelector}>
        <Text style={styles.label}>Start Time</Text>
        <Picker
          selectedValue={startTime}
          onValueChange={onStartTimeChange}
          style={styles.picker}
        >
          <Picker.Item label="8 AM" value="8 AM" />
          <Picker.Item label="9 AM" value="9 AM" />
          <Picker.Item label="10 AM" value="10 AM" />
          <Picker.Item label="11 AM" value="11 AM" />
          <Picker.Item label="12 PM" value="12 PM" />
          <Picker.Item label="1 PM" value="1 PM" />
          {/* Add more time options as needed */}
        </Picker>
      </View>
      <View style={styles.timeSelector}>
        <Text style={styles.label}>End Time</Text>
        <Picker
          selectedValue={endTime}
          onValueChange={onEndTimeChange}
          style={styles.picker}
        >
          <Picker.Item label="9 AM" value="9 AM" />
          <Picker.Item label="10 AM" value="10 AM" />
          <Picker.Item label="11 AM" value="11 AM" />
          <Picker.Item label="12 PM" value="12 PM" />
          <Picker.Item label="1 PM" value="1 PM" />
          <Picker.Item label="2 PM" value="2 PM" />
          {/* Add more time options as needed */}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 5,  // Reduce the margin to shrink the overall component
    padding: 10,   // Add padding to give it more space around
    maxHeight: 130,  // Shrink the overall height of the TimePicker
    marginLeft: 40,  // Add margin to move it to the right
    marginRight: 50,  // Add margin to move it to the left


  },
  timeSelector: {
    width: '60%',
    height: 100,  // Shrink the height of each time selector
  },
  label: {
    fontSize: 12,  // Reduce font size of the labels to make it more compact
    color: '#333',
    marginBottom: 5,  // Slight space between label and picker
  },
  picker: {
    height: 40,  // Shrink the height of the picker
    width: '100%',
    fontSize: 12,  // Reduce font size of picker items
  },
});

export default TimePicker;
