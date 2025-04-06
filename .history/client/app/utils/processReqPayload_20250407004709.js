// const processNearbyReqPayload = (googleaNearbyAPIResponse, userLocation) => {
const processNearbyReqPayload = (
  googleaNearbyAPIResponse,
  searchLocation,
  currentUserLocation
) => {
  console.log("PROCESSING");

  const EVLot = googleaNearbyAPIResponse.map((place) => ({
    formattedAddress: place.formattedAddress,
    shortformattedAddress: place.shortFormattedAddress,
    location: {
      lat: place.location.latitude,
      lng: place.location.longitude,
    },
    name: place.displayName.text,
    evChargeOptions: place.evChargeOptions
      ? {
          connectorCount: place.evChargeOptions.connectorCount || 0,
          connectorAggregation: place.evChargeOptions.connectorAggregation.map(
            (connector) => ({
              type: connector.type,
              count: connector.count,
              maxChargeRateKw: connector.maxChargeRateKw,
              ...(connector.availableCount !== undefined && {
                availableCount: connector.availableCount,
              }),
            })
          ),
        }
      : { connectorCount: 0, connectorAggregation: [] },
  }));

  return {
    EVLot: EVLot,
    // For distance calculations, always reference from the search location
    // This is the important part for sorting carparks by distance
    referenceLocation: {
      latitude: searchLocation.latitude,
      longitude: searchLocation.longitude,
    },
    // Keep both locations for other uses if needed
    SearchLocation: {
      latitude: searchLocation.latitude,
      longitude: searchLocation.longitude,
    },
    CurrentUserLocation: {
      latitude: currentUserLocation.latitude,
      longitude: currentUserLocation.longitude,
    },
  };
};

export default processNearbyReqPayload;
