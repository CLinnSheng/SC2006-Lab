package handler

import (
	"strconv"

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
		// Latitude  float64        `json:"latitude"`
		// Longitude float64        `json:"longitude"`
	}

	// EVLots := []*model.EVLot{}
	if err := c.BodyParser(&reqPayload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	ProcessedEVLots := []map[string]interface{}{}

	for _, EVLot := range reqPayload.EVLots {
		chargers := []map[string]string{}

		for _, connecter := range EVLot.EVChargerOptions.ConnectorAggregation {
			var availableCnt string
			if connecter.AvailableCount != nil {
				availableCnt = strconv.Itoa(*connecter.AvailableCount)
			} else {
				availableCnt = "N/A"
			}

			chargers = append(chargers, map[string]string{
				"type":            connecter.Type,
				"maxChargeRateKW": strconv.FormatFloat(connecter.MaxChargeRateKW, 'f', 1, 64),
				"count":           strconv.Itoa(connecter.Count),
				"availableCount":  availableCnt,
			})

		}

		routeInfo, _ := external_services.ComputeRoute(reqPayload.CurrentUserLocation.Latitude, reqPayload.CurrentUserLocation.Longitude, EVLot.Location.Latitude, EVLot.Location.Longitude)

		ProcessedEVLots = append(ProcessedEVLots, map[string]interface{}{
			"formattedAddress": EVLot.FormattedAddress,
			"location": map[string]float64{
				"latitude":  EVLot.Location.Latitude,
				"longitude": EVLot.Location.Longitude,
			},
			"displayName":   EVLot.Name,
			"chargers":      chargers,
			"totalChargers": EVLot.EVChargerOptions.ConnectorCount,
			"routeInfo": map[string]string{
				"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
				"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
				"polyline": routeInfo.Polyline,
			},
		})

	}

	// ProcessedCarPark := []model.CarPark{}
	// for _, carPark := range apiData.CarPark {
	// 	// if a := utils.CalculateDistance(reqPayload.Latitude, reqPayload.Longitude, carPark.Latitude, carPark.Longitude); a <= 2 {
	// 	if a := utils.CalculateDistance(reqPayload.SearchedLocation.Latitude, reqPayload.SearchedLocation.Longitude, carPark.Latitude, carPark.Longitude); a <= 2 {
	// 		ProcessedCarPark = append(ProcessedCarPark, *carPark)
	// 	}
	// }
	ProcessedCarPark := []map[string]interface{}{}
	for _, carPark := range apiData.CarPark {
		if a := utils.CalculateDistance(reqPayload.SearchedLocation.Latitude, reqPayload.SearchedLocation.Longitude, carPark.Latitude, carPark.Longitude); a <= 2 {
			// ProcessedCarPark = append(ProcessedCarPark, *carPark)
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

			routeInfo, _ := external_services.ComputeRoute(reqPayload.CurrentUserLocation.Latitude, reqPayload.CurrentUserLocation.Longitude, carPark.Latitude, carPark.Longitude)

			processedCarPark["routeInfo"] = map[string]string{
				"distance": strconv.FormatFloat(utils.ConvertMeterToKm(routeInfo.Distance), 'f', 1, 64),
				"duration": strconv.FormatFloat(utils.ConvertSecondsToMinutes(routeInfo.Duration), 'f', 0, 64),
				"polyline": routeInfo.Polyline,
			}

			ProcessedCarPark = append(ProcessedCarPark, processedCarPark)
		}
	}

	response := map[string]interface{}{
		"EV":      ProcessedEVLots,
		"CarPark": ProcessedCarPark,
	}

	return c.JSON(response)
}
