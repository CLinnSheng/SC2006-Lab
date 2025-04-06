import { useMemo } from 'react';
import { FilterOptions } from '../FilterBottomSheet';

/**
 * Custom hook to filter car parks based on filter criteria
 * @param carParks Array of car park objects to filter
 * @param filters Filter options to apply
 * @returns Filtered array of car parks
 */
export function useCarParkFilters(carParks: any[], filters: FilterOptions) {
  return useMemo(() => {
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
}