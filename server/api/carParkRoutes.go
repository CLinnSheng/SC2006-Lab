package api

import (
	"log"

	"github.com/SC2006-Lab/MobileAppProject/data"
	"github.com/SC2006-Lab/MobileAppProject/handler"
	"github.com/gofiber/fiber/v2"
)

func SetupCarParkRoutes(router fiber.Router, apiData *data.ApiData) {
	carParkGroup := router.Group("/carpark")
	
	// should be get but the payload req is too large
	carParkGroup.Post("/nearby", func(c *fiber.Ctx) error {
		log.Println("POST /api/carpark/nearby")
		return handler.GetNearbyCarParks(c, apiData)
	})
}