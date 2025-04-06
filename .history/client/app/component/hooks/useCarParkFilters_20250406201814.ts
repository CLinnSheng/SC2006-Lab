import { useMemo, useCallback } from 'react';
import { FilterOptions } from '../FilterBottomSheet';

/**
 * Custom hook to filter car parks based on filter criteria
 * @param carParks Array of car park objects to filter
 * @param filters Filter options to apply
 * @returns Filtered array of car parks and utility functions
 */
export function useCarParkFilters(carParks: any[], filters: FilterOptions) {
  // Filter the car parks based on the given criteria
  const filteredCarParks = useMemo(() => {
    return carParks.filter(carPark => {
      // Filter by distance
      if (carPark.routeInfo && carPark.routeInfo.distance) {
        const carParkDistance = parseFloat(carPark.routeInfo.distance);
        if (carParkDistance > filters.distance) {
          return false;
        }
      }

      // Filter by vehicle type
      if (filters.vehicleType) {
        // For Car type check if 'C' lots are available
        if (filters.vehicleType === 'Car' && carPark.type === 'CarPark') {
          if (!carPark.lotDetails?.C) {
            return false;
          }
        }
        // For Motorcycle type check if 'M' or 'Y' lots are available
        else if (filters.vehicleType === 'Motorcycle' && carPark.type === 'CarPark') {
          if (!carPark.lotDetails?.M && !carPark.lotDetails?.Y) {
            return false;
          }
        }
        // For Heavy Vehicle type check if 'H' lots are available
        else if (filters.vehicleType === 'Heavy Vehicle' && carPark.type === 'CarPark') {
          if (!carPark.lotDetails?.H) {
            return false;
          }
        }
      }

      // Filter by EV charging availability
      if (filters.evChargingAvailable) {
        // If EV charging is required, only include EV type
        if (carPark.type !== 'EV') {
          return false;
        }
      }

      // Filter by sheltered/unsheltered
      if (filters.sheltered !== null && carPark.type === 'CarPark') {
        const isSheltered = 
          carPark.carParkType === 'MULTI-STOREY CAR PARK' || 
          carPark.carParkType === 'BASEMENT CAR PARK';
        
        if (filters.sheltered !== isSheltered) {
          return false;
        }
      }

      return true;
    });
  }, [carParks, filters]);

  /**
   * Check if any car parks would pass the given filter criteria
   * @param filtersToCheck Filter options to validate
   * @returns Boolean indicating if any car parks would pass these filters
   */
  const wouldHaveResults = useCallback((filtersToCheck: FilterOptions) => {
    return carParks.some(carPark => {
      // Distance filter
      if (carPark.routeInfo && carPark.routeInfo.distance) {
        const carParkDistance = parseFloat(carPark.routeInfo.distance);
        if (carParkDistance > filtersToCheck.distance) {
          return false;
        }
      }

      // Vehicle type filter
      if (filtersToCheck.vehicleType) {
        if (filtersToCheck.vehicleType === 'Car' && carPark.type === 'CarPark') {
          if (!carPark.lotDetails?.C) {
            return false;
          }
        } else if (filtersToCheck.vehicleType === 'Motorcycle' && carPark.type === 'CarPark') {
          if (!carPark.lotDetails?.M && !carPark.lotDetails?.Y) {
            return false;
          }
        } else if (filtersToCheck.vehicleType === 'Heavy Vehicle' && carPark.type === 'CarPark') {
          if (!carPark.lotDetails?.H) {
            return false;
          }
        }
      }

      // EV charging filter
      if (filtersToCheck.evChargingAvailable) {
        if (carPark.type !== 'EV') {
          return false;
        }
      }

      // Sheltered filter
      if (filtersToCheck.sheltered !== null && carPark.type === 'CarPark') {
        const isSheltered = 
          carPark.carParkType === 'MULTI-STOREY CAR PARK' || 
          carPark.carParkType === 'BASEMENT CAR PARK';
        
        if (filtersToCheck.sheltered !== isSheltered) {
          return false;
        }
      }

      return true;
    });
  }, [carParks]);

  // Check if there are no matching car parks but we have applied filters
  const noMatchingCarParks = useMemo(() => {
    return filteredCarParks.length === 0 && carParks.length > 0;
  }, [filteredCarParks, carParks]);

  return {
    filteredCarParks,
    wouldHaveResults,
    noMatchingCarParks
  };
}