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
    // latitude: userLocation.latitude,
    // longitude: userLocation.longitude,
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
