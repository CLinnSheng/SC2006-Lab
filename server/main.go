package main

import (
	"log"

	"github.com/SC2006-Lab/MobileAppProject/config"
	"github.com/SC2006-Lab/MobileAppProject/external_services"
	"github.com/SC2006-Lab/MobileAppProject/middleware"
	"github.com/gofiber/fiber/v2"
)

func main() {
	log.Print("Loading dotenv file")
	envConfig := config.GetEnvConfig()

	// Create an instance of Fibre
	app := fiber.New(fiber.Config{
		AppName:       "ParkIt v1.0",
		ServerHeader:  "Fiber",
		CaseSensitive: true,
	})

	// Setting up the Fibre middleware
	middleware.Settings(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("TESTING")
	})

	external_services.GetDataGovDataWeather()
	// testing, err := external_services.GetDataGovDataWeather()
	// if err != nil {
	// 	log.Fatalf("Error getting data from external service %e", err)
	// }
	// log.Print(io.ReadAll(testing.Body))
	log.Fatal(app.Listen(":" + envConfig.Port))
}
