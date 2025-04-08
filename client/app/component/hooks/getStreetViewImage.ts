const getStreetViewUrl = (latitude: number, longitude: number) => {
  return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;
};

export default getStreetViewUrl;