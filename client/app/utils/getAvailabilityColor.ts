const getAvailabilityColor = (available: number, total: number) => {
    if (total === 0) return "#999";
    const ratio = available / total;
    if (ratio <= 0.2) return "red";
    if (ratio <= 0.5) return "orange";
    return "green";
  };

export default getAvailabilityColor;