package api

import (
	"github.com/SC2006-Lab/MobileAppProject/data"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, apiData *data.ApiData) {
	api := app.Group("/api")

	SetupCarParkRoutes(api, apiData)
}