package handler

import (
	"strconv"
	"sync"

	"github.com/SC2006-Lab/MobileAppProject/data"
	"github.com/SC2006-Lab/MobileAppProject/external_services"
	"github.com/SC2006-Lab/MobileAppProject/model"
	"github.com/SC2006-Lab/MobileAppProject/utils"
	"github.com/gofiber/fiber/v2"
)

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

	// Do the process of evlots and carpark concurrently
	var wg sync.WaitGroup
	wg.Add(2)

	var ProcessedEVLots []map[string]interface{}
	var ProcessedCarPark []map[string]interface{}
	var evLotsErr, carParkErr error

	// 2 go routine to process the evlots and carpark concurrently
	go func() {
		defer wg.Done()
		ProcessedEVLots, evLotsErr = processEVLots(reqPayload.EVLots, reqPayload.CurrentUserLocation, reqPayload.SearchedLocation, apiData)
	}()

	go func() {
		defer wg.Done()
		ProcessedCarPark, carParkErr = processCarParks(apiData.CarPark, reqPayload.CurrentUserLocation, reqPayload.SearchedLocation, apiData)
	}()

	// the main thread will wait for the 2 go routine to finish
	wg.Wait()

	if evLotsErr != nil || carParkErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error processing data",
		})
	}

	response := map[string]interface{}{
		"EV":      ProcessedEVLots,
		"CarPark": ProcessedCarPark,
	}

	return c.JSON(response)
}

func processEVLots(evLots []*model.EVLot, currentUserLocation, searchedLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}, apiData *data.ApiData) ([]map[string]interface{}, error) {
	var wg sync.WaitGroup
	var mut sync.Mutex // Prevent data race when updating the slice

	processedEVLots := []map[string]interface{}{}

	for _, EVLot := range evLots {
		wg.Add(1)

		go func(evLot *model.EVLot) {
			defer wg.Done()

			chargers := []map[string]string{}

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

			// We need to modify this to use the search location instead of current user location
			routeInfo, _ := external_services.ComputeRoute(searchedLocation.Latitude, searchedLocation.Longitude, evLot.Location.Latitude, evLot.Location.Longitude, *apiData.OneMapToken)

			processedEVLot := map[string]interface{}{
				"formattedAddress": evLot.FormattedAddress,
				"location": map[string]float64{
					"latitude":  evLot.Location.Latitude,
					"longitude": evLot.Location.Longitude,
				},
				"displayName":   evLot.Name,
				"chargers":      chargers,
				"totalChargers": evLot.EVChargerOptions.ConnectorCount,
				"routeInfo": map[string]string{
					"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
					"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
					"polyline": routeInfo.Polyline,
				},
			}

			// Prevent data race
			mut.Lock()
			processedEVLots = append(processedEVLots, processedEVLot)
			mut.Unlock()

		}(EVLot)
	}

	wg.Wait()
	return processedEVLots, nil
}

func processCarParks(carParks map[string]*model.CarPark, currentUserLocation, searchedLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}, apiData *data.ApiData) ([]map[string]interface{}, error) {
	processedCarParks := []map[string]interface{}{}

	var wg sync.WaitGroup
	var mut sync.Mutex

	for _, carPark := range carParks {
		wg.Add(1)

		go func(carPark *model.CarPark) {
			defer wg.Done()

			if a := utils.CalculateDistance(searchedLocation.Latitude, searchedLocation.Longitude, carPark.Latitude, carPark.Longitude); a <= 2 {
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

				// Calculate route info from the searched location, not current user location
				// This ensures distances are calculated from the location the user searched for
				routeInfo, _ := external_services.ComputeRoute(searchedLocation.Latitude, searchedLocation.Longitude, carPark.Latitude, carPark.Longitude, *apiData.OneMapToken)

				processedCarPark["routeInfo"] = map[string]string{
					"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
					"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
					"polyline": routeInfo.Polyline,
				}

				mut.Lock()
				processedCarParks = append(processedCarParks, processedCarPark)
				mut.Unlock()
			}

		}(carPark)
	}

	wg.Wait()
	return processedCarParks, nil
}
