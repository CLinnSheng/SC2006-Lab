package main

import (
	_"log"

	"github.com/SC2006-Lab/MobileAppProject/api"
	"github.com/SC2006-Lab/MobileAppProject/data"
	"github.com/SC2006-Lab/MobileAppProject/middleware"
	"github.com/gofiber/fiber/v2"
)

func main() {

	apiData := data.NewApiData()
	apiData.Init()

	server := middleware.NewServer()
	go func() {
		server.Init()
	}()

	api.SetupRoutes(server.App, apiData)
	server.App.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("TESTING")
	})

	// external_services.GetDataGovDataWeather()
	// external_services.InitCarParkInformation()

	select{}
}
