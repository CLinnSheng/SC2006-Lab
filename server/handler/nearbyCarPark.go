package handler

import (
	_ "fmt"
	"log"
	_ "log"
	"net/http"
	"strconv"
	_ "sync"
	"time"

	"github.com/SC2006-Lab/MobileAppProject/data"
	"github.com/SC2006-Lab/MobileAppProject/external_services"
	"github.com/SC2006-Lab/MobileAppProject/model"
	"github.com/SC2006-Lab/MobileAppProject/utils"
	"github.com/gofiber/fiber/v2"
)

// First Method that just keep spawning goroutines/thread to handle each carpark
// Spawning gorountines/threads is good idea but the performance will be bad when the number of gorountines is huge
// func GetNearbyCarParks(c *fiber.Ctx, apiData *data.ApiData) error {
// 	var reqPayload struct {
// 		EVLots              []*model.EVLot `json:"EVLot"`
// 		CurrentUserLocation struct {
// 			Latitude  float64 `json:"latitude"`
// 			Longitude float64 `json:"longitude"`
// 		} `json:"CurrentUserLocation"`
// 		SearchedLocation struct {
// 			Latitude  float64 `json:"latitude"`
// 			Longitude float64 `json:"longitude"`
// 		} `json:"SearchLocation"`
// 	}
// 	if err := c.BodyParser(&reqPayload); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 			"error": "Cannot parse JSON",
// 		})
// 	}
// 	// Do the process of evlots and carpark concurrently
// 	var wg sync.WaitGroup
// 	wg.Add(2)
// 	var ProcessedEVLots []map[string]interface{}
// 	var ProcessedCarPark []map[string]interface{}
// 	var evLotsErr, carParkErr error
// 	// 2 go routine to process the evlots and carpark concurrently
// 	go func() {
// 		defer wg.Done()
// 		ProcessedEVLots, evLotsErr = processEVLots(reqPayload.EVLots, reqPayload.CurrentUserLocation, apiData)
// 	}()
// 	go func() {
// 		defer wg.Done()
// 		ProcessedCarPark, carParkErr = processCarParks(apiData.CarPark, reqPayload.CurrentUserLocation, reqPayload.SearchedLocation, apiData)
// 	}()
// 	// the main thread will wait for the 2 go routine to finish
// 	wg.Wait()
// 	if evLotsErr != nil || carParkErr != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Error processing data",
// 		})
// 	}
// 	response := map[string]interface{}{
// 		"EV":      ProcessedEVLots,
// 		"CarPark": ProcessedCarPark,
// 	}
// 	log.Println("Returning response to client")
// 	return c.JSON(response)
// }
// func processEVLots(evLots []*model.EVLot, currentUserLocation struct {
// 	Latitude  float64 `json:"latitude"`
// 	Longitude float64 `json:"longitude"`
// }, apiData *data.ApiData) ([]map[string]interface{}, error) {
// 	var wg sync.WaitGroup
// 	var mut sync.Mutex // Prevent data race when updating the slice
// 	processedEVLots := []map[string]interface{}{}
// 	for _, EVLot := range evLots {
// 		wg.Add(1)
// 		// fmt.Print(EVLot)
// 		go func(evLot *model.EVLot) {
// 			defer wg.Done()
// 			chargers := []map[string]string{}
// 			for _, connector := range evLot.EVChargerOptions.ConnectorAggregation {
// 				var availableCnt string
// 				if connector.AvailableCount != nil {
// 					availableCnt = strconv.Itoa(*connector.AvailableCount)
// 				} else {
// 					availableCnt = "N/A"
// 				}
// 				chargers = append(chargers, map[string]string{
// 					"type":            connector.Type,
// 					"maxChargeRateKW": strconv.FormatFloat(connector.MaxChargeRateKW, 'f', 1, 64),
// 					"count":           strconv.Itoa(connector.Count),
// 					"availableCount":  availableCnt,
// 				})
// 			}
// 			routeInfo, _ := external_services.ComputeRoute(currentUserLocation.Latitude, currentUserLocation.Longitude, evLot.Location.Latitude, evLot.Location.Longitude, *apiData.OneMapToken)
// 			processedEVLot := map[string]interface{}{
// 				"formattedAddress": evLot.FormattedAddress,
// 				"location": map[string]float64{
// 					"latitude":  evLot.Location.Latitude,
// 					"longitude": evLot.Location.Longitude,
// 				},
// 				"shortFormattedAddress": evLot.ShortFormattedAddress,
// 				"displayName":   evLot.Name,
// 				"chargers":      chargers,
// 				"totalChargers": evLot.EVChargerOptions.ConnectorCount,
// 				"routeInfo": map[string]string{
// 					"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
// 					"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
// 					"polyline": routeInfo.Polyline,
// 				},
// 			}
// 			// Prevent data race
// 			mut.Lock()
// 			processedEVLots = append(processedEVLots, processedEVLot)
// 			mut.Unlock()
// 		}(EVLot)
// 	}
// 	wg.Wait()
// 	return processedEVLots, nil
// }

// func processCarParks(carParks map[string]*model.CarPark, currentUserLocation, searchedLocation struct {
// 	Latitude  float64 `json:"latitude"`
// 	Longitude float64 `json:"longitude"`
// }, apiData *data.ApiData) ([]map[string]interface{}, error) {
// 	processedCarParks := []map[string]interface{}{}
// 	var wg sync.WaitGroup
// 	var mut sync.Mutex
// 	for _, carPark := range carParks {
// 		wg.Add(1)
// 		go func(carPark *model.CarPark) {
// 			defer wg.Done()
// 			if a := utils.CalculateDistance(searchedLocation.Latitude, searchedLocation.Longitude, carPark.Latitude, carPark.Longitude); a <= 2 {
// 				processedCarPark := map[string]interface{}{
// 					"carParkID":   carPark.CarParkID,
// 					"address":     carPark.Address,
// 					"carParkType": carPark.CarParkType,
// 					"latitude":    carPark.Latitude,
// 					"longitude":   carPark.Longitude,
// 					"lotDetails":  make(map[string]interface{}),
// 				}
// 				for lotType, lot := range carPark.LotDetails {
// 					processedCarPark["lotDetails"].(map[string]interface{})[lotType] = map[string]string{
// 						"totalLots":     lot.TotalLots,
// 						"availableLots": lot.AvailableLots,
// 					}
// 				}
// 				routeInfo, _ := external_services.ComputeRoute(currentUserLocation.Latitude, currentUserLocation.Longitude, carPark.Latitude, carPark.Longitude, *apiData.OneMapToken)
// 				processedCarPark["routeInfo"] = map[string]string{
// 					"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
// 					"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
// 					"polyline": routeInfo.Polyline,
// 				}
// 				mut.Lock()
// 				processedCarParks = append(processedCarParks, processedCarPark)
// 				mut.Unlock()
// 			}
// 		}(carPark)
// 	}
// 	wg.Wait()
// 	return processedCarParks, nil
// }

// Alternative method is actually limiting the number of goroutines/threads to a reasonable number
// and using a worker pool to process the data concurrently
// This method is more efficient and scalable
// The worker pool will limit the number of goroutines/threads to a reasonable number
// and use a channel to distribute the work among the workers
func GetNearbyCarParks(c *fiber.Ctx, apiData *data.ApiData) error {
	var reqPayload struct {
		EVLots              []*model.EVLot `json:"EVLot"`
		CurrentUserLocation struct {
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
		} `json:"CurrentUserLocation"`
		SearchedLocation struct {
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
		} `json:"SearchLocation"`
	}

	if err := c.BodyParser(&reqPayload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	// Create channels for results and errors
	processedEVLotsChan := make(chan []map[string]interface{}, 1)
	processedCarParkChan := make(chan []map[string]interface{}, 1)
	errChan := make(chan error, 2)

	// Process EV lots
	go func() {
		processedEVLots, err := processEVLots(reqPayload.EVLots, reqPayload.CurrentUserLocation, apiData)
		if err != nil {
			errChan <- err
			return
		}
		processedEVLotsChan <- processedEVLots
	}()

	// Process car parks
	go func() {
		// Pre-filter car parks by distance before detailed processing
		nearbyCarParks := preFilterCarParks(apiData.CarPark, reqPayload.SearchedLocation, 2.5) // Slightly larger radius for pre-filtering

		processedCarPark, err := processCarParks(nearbyCarParks, reqPayload.CurrentUserLocation, reqPayload.SearchedLocation, apiData)
		if err != nil {
			errChan <- err
			return
		}
		processedCarParkChan <- processedCarPark
	}()

	// Collect results
	var processedEVLots, processedCarPark []map[string]interface{}
	var errCount int

	// Wait for both goroutines to complete or return early on errors
	for range 2 {
		select {
		case <-errChan:
			errCount++
			if errCount == 2 {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Error processing data",
				})
			}
		case result := <-processedEVLotsChan:
			processedEVLots = result
		case result := <-processedCarParkChan:
			processedCarPark = result
		}
	}

	response := map[string]interface{}{
		"EV":      processedEVLots,
		"CarPark": processedCarPark,
	}

	log.Println("Returning response to client")
	return c.JSON(response)
}

// Pre-filter carparks based on distance to reduce the number of detailed computations
func preFilterCarParks(carParks map[string]*model.CarPark, searchedLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}, maxDistance float64) map[string]*model.CarPark {
	result := make(map[string]*model.CarPark)

	for id, carPark := range carParks {
		if distance := utils.CalculateDistance(searchedLocation.Latitude, searchedLocation.Longitude,
			carPark.Latitude, carPark.Longitude); distance <= maxDistance {
			result[id] = carPark
		}
	}

	return result
}

func processEVLots(evLots []*model.EVLot, currentUserLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}, apiData *data.ApiData) ([]map[string]interface{}, error) {
	// Set a reasonable worker limit to avoid overwhelming the system
	const maxWorkers = 10
	workerLimit := min(len(evLots), maxWorkers)

	// Create a buffered channel for work distribution
	jobChan := make(chan *model.EVLot, len(evLots))
	resultChan := make(chan map[string]interface{}, len(evLots))
	errChan := make(chan error, 1)

	// Use a separate client for each worker for better connection reuse
	oneMapToken := *apiData.OneMapToken

	// Launch workers
	for i := 0; i < workerLimit; i++ {
		go func() {
			client := &http.Client{
				Transport: &http.Transport{
					MaxIdleConnsPerHost: 10,
					IdleConnTimeout:     30 * time.Second,
				},
			}

			for evLot := range jobChan {
				processedLot, err := processEVLot(evLot, currentUserLocation, oneMapToken, client)
				if err != nil {
					errChan <- err
					return
				}
				resultChan <- processedLot
			}
		}()
	}

	// Send jobs to workers
	go func() {
		for _, evLot := range evLots {
			jobChan <- evLot
		}
		close(jobChan)
	}()

	// Collect results
	processedEVLots := make([]map[string]interface{}, 0, len(evLots))

	for i := 0; i < len(evLots); i++ {
		select {
		case err := <-errChan:
			return nil, err
		case result := <-resultChan:
			processedEVLots = append(processedEVLots, result)
		}
	}

	return processedEVLots, nil
}

// Process a single EV lot
func processEVLot(evLot *model.EVLot, currentUserLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}, oneMapToken string, client *http.Client) (map[string]interface{}, error) {
	chargers := make([]map[string]string, 0, len(evLot.EVChargerOptions.ConnectorAggregation))

	for _, connector := range evLot.EVChargerOptions.ConnectorAggregation {
		var availableCnt string
		if connector.AvailableCount != nil {
			availableCnt = strconv.Itoa(*connector.AvailableCount)
		} else {
			availableCnt = "N/A"
		}

		chargers = append(chargers, map[string]string{
			"type":            connector.Type,
			"maxChargeRateKW": strconv.FormatFloat(connector.MaxChargeRateKW, 'f', 1, 64),
			"count":           strconv.Itoa(connector.Count),
			"availableCount":  availableCnt,
		})
	}

	routeInfo, err := external_services.ComputeRoute(
		currentUserLocation.Latitude,
		currentUserLocation.Longitude,
		evLot.Location.Latitude,
		evLot.Location.Longitude,
		oneMapToken,
		client,
	)

	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"formattedAddress": evLot.FormattedAddress,
		"location": map[string]float64{
			"latitude":  evLot.Location.Latitude,
			"longitude": evLot.Location.Longitude,
		},
		"shortFormattedAddress": evLot.ShortFormattedAddress,
		"displayName":           evLot.Name,
		"chargers":              chargers,
		"totalChargers":         evLot.EVChargerOptions.ConnectorCount,
		"routeInfo": map[string]string{
			"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
			"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
			"polyline": routeInfo.Polyline,
		},
	}, nil
}

func processCarParks(carParks map[string]*model.CarPark, currentUserLocation, searchedLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}, apiData *data.ApiData) ([]map[string]interface{}, error) {
	// Set a reasonable worker limit
	const maxWorkers = 10
	carParkList := make([]*model.CarPark, 0, len(carParks))

	for _, carPark := range carParks {
		if utils.CalculateDistance(searchedLocation.Latitude, searchedLocation.Longitude, carPark.Latitude, carPark.Longitude) <= 2 {
			carParkList = append(carParkList, carPark)
		}
	}

	workerLimit := min(len(carParkList), maxWorkers)

	// Create channels for work distribution
	jobChan := make(chan *model.CarPark, len(carParkList))
	resultChan := make(chan map[string]interface{}, len(carParkList))
	errChan := make(chan error, 1)

	oneMapToken := *apiData.OneMapToken

	// Launch workers
	for i := 0; i < workerLimit; i++ {
		go func() {
			client := &http.Client{
				Transport: &http.Transport{
					MaxIdleConnsPerHost: 10,
					IdleConnTimeout:     30 * time.Second,
				},
			}

			for carPark := range jobChan {
				processedCarPark := map[string]interface{}{
					"carParkID":   carPark.CarParkID,
					"address":     carPark.Address,
					"carParkType": carPark.CarParkType,
					"latitude":    carPark.Latitude,
					"longitude":   carPark.Longitude,
					"lotDetails":  make(map[string]interface{}),
				}

				for lotType, lot := range carPark.LotDetails {
					processedCarPark["lotDetails"].(map[string]interface{})[lotType] = map[string]string{
						"totalLots":     lot.TotalLots,
						"availableLots": lot.AvailableLots,
					}
				}

				routeInfo, err := external_services.ComputeRoute(
					currentUserLocation.Latitude,
					currentUserLocation.Longitude,
					carPark.Latitude,
					carPark.Longitude,
					oneMapToken,
					client,
				)

				if err != nil {
					errChan <- err
					return
				}

				processedCarPark["routeInfo"] = map[string]string{
					"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
					"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
					"polyline": routeInfo.Polyline,
				}

				resultChan <- processedCarPark
			}
		}()
	}

	// Send jobs to workers
	go func() {
		for _, carPark := range carParkList {
			jobChan <- carPark
		}
		close(jobChan)
	}()

	// Collect results
	processedCarParks := make([]map[string]interface{}, 0, len(carParkList))

	for i := 0; i < len(carParkList); i++ {
		select {
		case err := <-errChan:
			return nil, err
		case result := <-resultChan:
			processedCarParks = append(processedCarParks, result)
		}
	}

	return processedCarParks, nil
}
