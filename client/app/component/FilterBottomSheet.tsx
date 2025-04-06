import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Switch } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SharedValue, useSharedValue, useAnimatedReaction } from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import Slider from '@react-native-community/slider';
import SCREEN_DIMENSIONS from "../constants/screenDimension";

export interface FilterOptions {
  distance: number; // Distance in km
  vehicleType: 'Car' | 'Motorcycle' | 'Heavy Vehicle';
  evChargingAvailable: boolean;
  sheltered: boolean | null; // true = sheltered, false = unsheltered, null = both
}

interface FilterBottomSheetProps {
  onClose: () => void;
  bottomSheetPosition: SharedValue<number>;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  warning: string | null;
  onResetFilters: () => void;
}

const FilterBottomSheet = ({
  onClose,
  bottomSheetPosition,
  onApplyFilters,
  currentFilters,
  warning,
  onResetFilters,
}: FilterBottomSheetProps) => {
  const filterBottomSheetRef = useRef<BottomSheet>(null);
  const filterBottomSheetPosition = useSharedValue(0);

  // Local state for filter values
  const [distance, setDistance] = useState(currentFilters.distance);
  const [vehicleType, setVehicleType] = useState<'Car' | 'Motorcycle' | 'Heavy Vehicle'>(currentFilters.vehicleType);
  const [evChargingAvailable, setEvChargingAvailable] = useState(currentFilters.evChargingAvailable);
  const [sheltered, setSheltered] = useState<boolean | null>(currentFilters.sheltered);

  // Sync the filter bottom sheet position with the parent bottom sheet position
  useAnimatedReaction(
    () => filterBottomSheetPosition.value,
    (currentPosition) => {
      bottomSheetPosition.value = currentPosition;
    }
  );

  const applyFilters = () => {
    onApplyFilters({
      distance,
      vehicleType,
      evChargingAvailable,
      sheltered,
    });
  };

  const resetFilters = () => {
    setDistance(1);
    setVehicleType('Car');
    setEvChargingAvailable(false);
    setSheltered(null);
    onResetFilters();
  };

  const renderVehicleTypeButton = (type: 'Car' | 'Motorcycle' | 'Heavy Vehicle') => (
    <TouchableOpacity 
      style={[
        styles.vehicleTypeButton,
        vehicleType === type ? styles.vehicleTypeButtonSelected : {}
      ]}
      onPress={() => setVehicleType(type)}
    >
      <Text 
        style={[
          styles.vehicleTypeText, 
          vehicleType === type ? styles.vehicleTypeTextSelected : {}
        ]}
      >
        {type}
      </Text>
    </TouchableOpacity>
  );

  const renderShelteredOption = (option: boolean | null, label: string) => (
    <TouchableOpacity 
      style={[
        styles.shelteredOption,
        sheltered === option ? styles.shelteredOptionSelected : {}
      ]}
      onPress={() => setSheltered(option)}
    >
      <Text 
        style={[
          styles.shelteredOptionText, 
          sheltered === option ? styles.shelteredOptionTextSelected : {}
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={filterBottomSheetRef}
      index={1}
      snapPoints={["25%", "80%"]}
      backgroundStyle={{ backgroundColor: "#F5F5F7" }}
      enablePanDownToClose={true}
      onClose={onClose}
      animatedPosition={filterBottomSheetPosition}
    >
      <BottomSheetView style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="closecircle" size={16} color="grey" />
        </TouchableOpacity>

        <Text style={styles.title}>Filter Parking Locations</Text>
        
        {/* Warning message */}
        {warning && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{warning}</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Distance Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Distance Range: {distance} km</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={5}
            step={0.5}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#007AFF"
          />
          <View style={styles.sliderLabels}>
            <Text>0.5 km</Text>
            <Text>5 km</Text>
          </View>
        </View>

        {/* Vehicle Type Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Vehicle Type</Text>
          <View style={styles.vehicleTypeContainer}>
            {renderVehicleTypeButton('Car')}
            {renderVehicleTypeButton('Motorcycle')}
            {renderVehicleTypeButton('Heavy Vehicle')}
          </View>
        </View>

        {/* EV Charging Filter */}
        <View style={styles.filterSection}>
          <View style={styles.switchRow}>
            <Text style={styles.filterTitle}>EV Charging Available</Text>
            <Switch
              value={evChargingAvailable}
              onValueChange={setEvChargingAvailable}
              trackColor={{ false: "#D3D3D3", true: "#81b0ff" }}
              thumbColor={evChargingAvailable ? "#007AFF" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Sheltered Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Parking Type</Text>
          <View style={styles.shelteredContainer}>
            {renderShelteredOption(true, 'Sheltered')}
            {renderShelteredOption(false, 'Unsheltered')}
            {renderShelteredOption(null, 'All')}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetFilters}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.applyButton}
            onPress={applyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  warningContainer: {
    backgroundColor: "#FFEEEE",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6666",
  },
  warningText: {
    color: "#CC0000",
    fontSize: 14,
    marginBottom: 8,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#FFFFFF',
  },
  vehicleTypeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  vehicleTypeText: {
    fontSize: 14,
    color: '#333',
  },
  vehicleTypeTextSelected: {
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shelteredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shelteredOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#FFFFFF',
  },
  shelteredOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  shelteredOptionText: {
    fontSize: 14,
    color: '#333',
  },
  shelteredOptionTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 13,
    borderRadius: 12,
    flex: 3,
    marginLeft: 10,
  },
  resetButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 13,
    borderRadius: 12,
    flex: 1,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  resetButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default FilterBottomSheet;