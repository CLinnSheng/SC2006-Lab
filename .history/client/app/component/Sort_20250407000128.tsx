import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type SortOption = 'distance' | 'availability' | 'price';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  sortBy: SortOption;
  direction: SortDirection;
}

type SortProps = {
  onApplySort: (options: SortOptions) => void;
  currentSort: SortOptions;
}

// Define a type for Material Icons specifically for our sort direction icons
type SortDirectionIcon = 'arrow-upward' | 'arrow-downward';

type SortMenuOption = {
  id: string;
  label: string;
  sortBy: SortOption;
}

const Sort = ({ onApplySort, currentSort }: SortProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleOptionSelect = (option: SortMenuOption) => {
    // If this is the reset option
    if (option.id === 'reset') {
      // Reset to default sorting (you can define your own default values)
      onApplySort({
        sortBy: 'distance', // Default sort option
        direction: 'asc'    // Default direction
      });
    } 
    // If the same option is selected, toggle the direction
    else if (option.sortBy === currentSort.sortBy) {
      onApplySort({
        ...currentSort,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // If a different option is selected, use that sort option with current direction
      onApplySort({
        sortBy: option.sortBy,
        direction: currentSort.direction
      });
    }
    setShowDropdown(false);
  };

  const sortByOptions: SortMenuOption[] = [
    { id: 'distance', label: 'Distance', sortBy: 'distance' },
    { id: 'availability', label: 'Availability', sortBy: 'availability' },
    { id: 'price', label: 'Price', sortBy: 'price' }
  ];

  // Add a reset option to the dropdown
  const allOptions = [
    ...sortByOptions,
    { id: 'reset', label: 'Cancel Sorting', sortBy: 'distance' } // Using 'distance' as default sortBy
  ];

  const getSortByLabel = () => {
    const option = sortByOptions.find(opt => opt.sortBy === currentSort.sortBy);
    return option ? option.label : 'Sort by';
  };

  const getDirectionIcon = (): SortDirectionIcon => {
    return currentSort.direction === 'asc' ? 'arrow-upward' : 'arrow-downward';
  };

  const getOptionDirectionIcon = (option: SortMenuOption): SortDirectionIcon | null => {
    if (option.sortBy === currentSort.sortBy) {
      return currentSort.direction === 'asc' ? 'arrow-upward' : 'arrow-downward';
    }
    return null;
  };

  const renderItem = ({ item }: { item: SortMenuOption }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => handleOptionSelect(item)}
    >
      <View style={styles.menuItemTextContainer}>
        {item.id === 'reset' ? (
          <>
            <MaterialIcons name="clear" size={18} color="#FF3B30" style={styles.resetIcon} />
            <Text style={[styles.menuItemText, styles.resetText]}>{item.label}</Text>
          </>
        ) : (
          <Text style={styles.menuItemText}>{item.label}</Text>
        )}
      </View>
      <View style={styles.menuItemIconContainer}>
        {item.id !== 'reset' && getOptionDirectionIcon(item) && (
          <MaterialIcons 
            name={getOptionDirectionIcon(item) as SortDirectionIcon} 
            size={18} 
            color="#007AFF" 
            style={styles.directionIcon} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShowDropdown(true)}>
        <MaterialIcons name="sort" size={24} color="white" />
        <Text style={styles.buttonText}>
          {`${getSortByLabel()}`}
        </Text>
        <MaterialIcons name={getDirectionIcon()} size={18} color="white" style={styles.buttonDirectionIcon} />
        <MaterialIcons name="arrow-drop-down" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdown}>
            <Text style={styles.dropdownHeader}>Sort By</Text>
            <FlatList
              data={allOptions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={renderSeparator}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    marginLeft: 5,
    marginRight: 5,
  },
  buttonDirectionIcon: {
    marginRight: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 5,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuItemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIconContainer: {
    width: 24, // Fixed width to ensure consistent layout
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
  },
  directionIcon: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  resetIcon: {
    marginRight: 6,
  },
  resetText: {
    color: '#FF3B30', // Red color for cancel text
  },
});

export default Sort;