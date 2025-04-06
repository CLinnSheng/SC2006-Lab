import { useState, useCallback, useMemo } from 'react';
import { SortOptions } from '../Sort';

const useCarParkSorting = (carparks: any[]) => {
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'distance',
    direction: 'asc',
    active: true // Default sorting is active
  });
  
  const applySorting = useCallback((options: SortOptions) => {
    setSortOptions(options);
  }, []);

  const sortedCarParks = useMemo(() => {
    if (!carparks || carparks.length === 0) return [];
    
    // If sorting is not active, return carparks without sorting
    if (!sortOptions.active) {
      return [...carparks];
    }
    
    return [...carparks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOptions.sortBy) {
        case 'distance':
          comparison = (a.distance || 0) - (b.distance || 0);
          break;
        case 'availability':
          // Assuming availableLots is the property for availability
          comparison = (a.availableLots || 0) - (b.availableLots || 0);
          break;
        case 'price':
          // Assuming pricing is the property for price
          comparison = (a.pricing || 0) - (b.pricing || 0);
          break;
        default:
          comparison = (a.distance || 0) - (b.distance || 0);
      }
      
      // Apply sorting direction
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    });
  }, [carparks, sortOptions]);

  return {
    sortOptions,
    applySorting,
    sortedCarParks
  };
};

export default useCarParkSorting;