package main

import (
	"github.com/SC2006-Lab/MobileAppProject/data"
	"github.com/SC2006-Lab/MobileAppProject/middleware"
)

func main() {

	apiData := data.NewApiData()
	apiData.Init()
	go func() {
		middleware.ServerInit()
	}()

	// server.App.Get("/", func(c *fiber.Ctx) error {
	// 	return c.SendString("TESTING")
	// })

	// external_services.GetDataGovDataWeather()
	// external_services.InitCarParkInformation()

	select{}
}
