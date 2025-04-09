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
    case "SURFACE/MULTI-STOREY CAR PARK":
      return "Sheltered";
  }
};

export default {
  getCarParkTypeLabel,
};
