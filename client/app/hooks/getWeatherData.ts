const getWeatherIcon = async (latitude: number, longitude: number) => {
  try {
    const apiURL = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}`;
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.weatherCondition.iconBaseUri;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export default getWeatherIcon;
