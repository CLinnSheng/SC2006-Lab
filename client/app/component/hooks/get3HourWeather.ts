const getWeatherForecast = async (latitude: number, longitude: number) => {
    try {
      const apiURL = `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}&hours=3`;
      const response = await fetch(apiURL);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      
      // Return the complete forecast data
      return data;
    } catch (error) {
      console.error("Error fetching weather forecast data:", error);
      return null;
    }
  };
  
  export default getWeatherForecast;