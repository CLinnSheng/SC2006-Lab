package external_services

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/SC2006-Lab/MobileAppProject/model"
)

func GetDataGovDataWeather() {
	resp, err := http.Get("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast") // Make an HTTP GET request to the specified URL
	if err != nil {                                                                        // Check if there was an error making the request
		log.Fatalf("Fail to fetch URL: %v", err)
	}

	// Might delete this later because we need to keep fetching weather data from the API
	defer resp.Body.Close() // Ensure the response body is closed after the function completes

	body, err := io.ReadAll(resp.Body) // Read the response body as a slice of bytes ([]byte)
	if err != nil {
		log.Fatalf("Fail to read response body: %v", err)
	}

	var response model.Response
	err = json.Unmarshal(body, &response)
	if err != nil {
		log.Fatalf("Fail to unmarshal JSON: %v", err)
	}

	// map to store the data for easy accessing the data of the area
	// area -> weather information & area information
	areaData := make(map[string]model.AreaInfo)

	// temp map to store location information
	locationData := make(map[string]model.LabelLocation)
	for _, area := range response.Data.AreaMetadata {
		locationData[area.Name] = area.LabelLocation
	}

	for _, forecast := range response.Data.Items[0].Forecasts {
		location, exists := locationData[forecast.Area]
		if exists {
			areaData[forecast.Area] = model.AreaInfo{
				Name:      forecast.Area,
				Latitude:  location.Latitude,
				Longitude: location.Longitude,
				Weather:   forecast.Forecast,
			}
		}
	}

	for name, info := range areaData {
		fmt.Printf("Area: %s\n", name)
		fmt.Printf("  Latitude: %f\n", info.Latitude)
		fmt.Printf("  Longitude: %f\n", info.Longitude)
		fmt.Printf("  Weather: %s\n\n", info.Weather)
	}
}
