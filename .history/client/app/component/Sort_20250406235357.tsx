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
  sortBy?: SortOption;
  direction?: SortDirection;
  icon?: SortDirectionIcon;
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
    { id: 'asc', label: 'Ascending', direction: 'asc', icon: 'arrow-upward' },
    { id: 'desc', label: 'Descending', direction: 'desc', icon: 'arrow-downward' }
  ];

  const getSortByLabel = () => {
    const option = sortByOptions.find(opt => opt.sortBy === currentSort.sortBy);
    return option ? option.label : 'Sort by';
  };

  const getDirectionLabel = () => {
    const option = directionOptions.find(opt => opt.direction === currentSort.direction);
    return option ? option.label : '';
  };

  const getDirectionIcon = (): SortDirectionIcon => {
    return currentSort.direction === 'asc' ? 'arrow-upward' : 'arrow-downward';
  };

  const renderItem = ({ item }: { item: SortMenuOption }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => handleOptionSelect(item)}
    >
      <View style={styles.menuItemTextContainer}>
        <Text style={styles.menuItemText}>{item.label}</Text>
        {item.icon && (
          <MaterialIcons name={item.icon} size={16} color="#333" style={styles.directionIcon} />
        )}
      </View>
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
  menuItemTextContainer: {
    flexDirection: 'row',
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
  sectionDivider: {
    height: 1,
    backgroundColor: '#dddddd',
    marginVertical: 8,
  },
});

export default Sort;