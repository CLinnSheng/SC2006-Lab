import { useState, useCallback, useMemo, useContext } from 'react';
import { SortOptions } from '../Sort';
import { UserLocationContext } from '../../context/userLocation';

const useCarParkSorting = (carparks: any[]) => {
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'distance',
    direction: 'asc',
    active: true // Default sorting is active
  });
  
  // Get context to check if we're showing search results or user location results
  const { isShowingSearchedLocation } = useContext(UserLocationContext);
  
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
          // Fixed: use routeInfo.distance instead of direct distance property
          const distanceA = a.routeInfo?.distance || Number.MAX_SAFE_INTEGER;
          const distanceB = b.routeInfo?.distance || Number.MAX_SAFE_INTEGER;
          comparison = distanceA - distanceB;
          break;
        case 'availability':
          // Correctly access the available lots from lotDetails
          const availableLotsA = a.lotDetails?.C?.availableLots || 0;
          const availableLotsB = b.lotDetails?.C?.availableLots || 0;
          comparison = availableLotsA - availableLotsB;
          break;
        case 'price':
          // Assuming pricing is the property for price
          comparison = (a.pricing || 0) - (b.pricing || 0);
          break;
        default:
          // Default back to distance sorting with proper property access
          const defaultDistanceA = a.routeInfo?.distance || Number.MAX_SAFE_INTEGER;
          const defaultDistanceB = b.routeInfo?.distance || Number.MAX_SAFE_INTEGER;
          comparison = defaultDistanceA - defaultDistanceB;
      }
      
      // Apply sorting direction
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    });
  }, [carparks, sortOptions]);

  return {
    sortOptions,
    applySorting,
    sortedCarParks,
    isShowingSearchedLocation // Also expose this state to components
  };
};

export default useCarParkSorting;