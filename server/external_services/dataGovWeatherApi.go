package external_services

import (
	"encoding/json"
	_ "fmt"
	"io"
	"log"
	"net/http"

	"github.com/SC2006-Lab/MobileAppProject/model"
)

func GetDataGovDataWeather() {
	log.Println("Fetching Weather Information from DataGov")
	resp, err := http.Get("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast") 
	if err != nil {                                                                        
		log.Fatalf("Fail to fetch URL: %v", err)
	}

	body, err := io.ReadAll(resp.Body) 
	if err != nil {
		log.Fatalf("Fail to read response body: %v", err)
	}
	log.Println("Fetched Weather Information from DataGov")

	var response model.DataGov_Api_Weather_Resp
	err = json.Unmarshal(body, &response)
	if err != nil {
		log.Fatalf("Fail to unmarshal JSON: %v", err)
	}


	// temp map to store location information
	log.Println("Processing Weather Information")
	locationData := make(map[string]model.LabelLocation)
	for _, area := range response.Data.AreaMetadata {
		locationData[area.Name] = area.LabelLocation
	}


	// map to store the data for easy accessing the data of the area
	// area -> weather information & area information
	areaData := make(map[string]model.WeatherAreaInfo)
	for _, forecast := range response.Data.Items[0].Forecasts {
		location, exists := locationData[forecast.Area]
		if exists {
			areaData[forecast.Area] = model.WeatherAreaInfo{
				Name:      forecast.Area,
				Latitude:  location.Latitude,
				Longitude: location.Longitude,
				Weather:   forecast.Forecast,
			}
		}
	}
	log.Println("Processed Weather Information")

	// for name, info := range areaData {
	// 	fmt.Printf("Area: %s\n", name)
	// 	fmt.Printf("  Latitude: %f\n", info.Latitude)
	// 	fmt.Printf("  Longitude: %f\n", info.Longitude)
	// 	fmt.Printf("  Weather: %s\n\n", info.Weather)
	// }
	// log.Println("Weather Information Printed")

	defer func() {
		log.Println("Closing response body for Weather Information")
		resp.Body.Close()
	}()
}
