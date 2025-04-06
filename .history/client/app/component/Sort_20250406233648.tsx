import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SortOption, SortDirection, SortOptions } from './SortBottomSheet';

type SortProps = {
  onApplySort: (options: SortOptions) => void;
  currentSort: SortOptions;
}

type SortMenuOption = {
  id: string;
  label: string;
  sortBy?: SortOption;
  direction?: SortDirection;
}

const Sort = ({ onApplySort, currentSort }: SortProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleOptionSelect = (option: SortMenuOption) => {
    if (option.sortBy) {
      onApplySort({
        ...currentSort,
        sortBy: option.sortBy
      });
    } else if (option.direction) {
      onApplySort({
        ...currentSort,
        direction: option.direction
      });
    }
    setShowDropdown(false);
  };

  const sortByOptions: SortMenuOption[] = [
    { id: 'distance', label: 'Distance', sortBy: 'distance' },
    { id: 'availability', label: 'Availability', sortBy: 'availability' },
    { id: 'price', label: 'Price', sortBy: 'price' }
  ];

  const directionOptions: SortMenuOption[] = [
    { id: 'asc', label: 'Ascending', direction: 'asc' },
    { id: 'desc', label: 'Descending', direction: 'desc' }
  ];

  const getSortByLabel = () => {
    const option = sortByOptions.find(opt => opt.sortBy === currentSort.sortBy);
    return option ? option.label : 'Sort by';
  };

  const getDirectionLabel = () => {
    const option = directionOptions.find(opt => opt.direction === currentSort.direction);
    return option ? option.label : '';
  };

  const renderItem = ({ item }: { item: SortMenuOption }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => handleOptionSelect(item)}
    >
      <Text style={styles.menuItemText}>{item.label}</Text>
      {((item.sortBy && item.sortBy === currentSort.sortBy) || 
        (item.direction && item.direction === currentSort.direction)) && (
        <MaterialIcons name="check" size={16} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShowDropdown(true)}>
        <MaterialIcons name="sort" size={24} color="white" />
        <Text style={styles.buttonText}>
          {`${getSortByLabel()}: ${getDirectionLabel()}`}
        </Text>
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
              data={sortByOptions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={renderSeparator}
            />
            
            <View style={styles.sectionDivider} />
            
            <Text style={styles.dropdownHeader}>Direction</Text>
            <FlatList
              data={directionOptions}
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
    marginRight: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 170, // Position below the sort button
    right: 15,
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
  menuItemText: {
    fontSize: 15,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#dddddd',
    marginVertical: 8,
  },
});

export default Sort;