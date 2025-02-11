package external_services

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func GetDataGovDataWeather() {
	resp, err := http.Get("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast") // Make an HTTP GET request to the specified URL
	if err != nil {                                                                        // Check if there was an error making the request
		log.Fatal(err) // Log the error and exit the program
	}

	// Might delete this later because we need to keep fetching weather data from the API
	defer resp.Body.Close()            // Ensure the response body is closed after the function completes
	body, err := io.ReadAll(resp.Body) // Read the response body as a slice of bytes ([]byte)
	if err != nil {                    // Check if there was an error reading the response body
		log.Fatal(err) // Log the error and exit the program
	}
	fmt.Println(string(body)) // Print the response body as a string
}
