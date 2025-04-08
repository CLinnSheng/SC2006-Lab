const getCarParkIcon = (
  type:
    | "MULTI-STOREY CAR PARK"
    | "SURFACE CAR PARK"
    | "BASEMENT CAR PARK"
    | "SURFACE/MULTI-STOREY CAR PARK"
    | string
) => {
  switch (type) {
    case "MULTI-STOREY CAR PARK":
      return "business-outline"; // Sheltered, so use a building icon
    case "SURFACE CAR PARK":
      return "car-outline"; // Unsheltered, so use a car icon
    case "BASEMENT CAR PARK":
      return "download-outline"; // Basement, so use a downward arrow
    case "SURFACE/MULTI-STOREY CAR PARK":
      return "business-outline";
    default:
      return "help-circle-outline"; // Default for unknown types
  }
};

const getCarParkTypeLabel = (
  type:
    | "MULTI-STOREY CAR PARK"
    | "SURFACE CAR PARK"
    | "BASEMENT CAR PARK"
    | string
) => {
  switch (type) {
    case "MULTI-STOREY CAR PARK":
      return "Sheltered";
    case "SURFACE CAR PARK":
      return "Unsheltered";
    case "BASEMENT CAR PARK":
      return "Basement";
    default:
      return "N/A";
  }
};

export default {
  getCarParkIcon,
  getCarParkTypeLabel,
};
