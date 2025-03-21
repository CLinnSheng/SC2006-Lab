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

	server := middleware.NewServer()
	middleware.Settings(server.App)

	server.App.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("TESTING")
	})

	external_services.GetDataGovDataWeather()
	// testing, err := external_services.GetDataGovDataWeather()
	// if err != nil {
	// 	log.Fatalf("Error getting data from external service %e", err)
	// }
	// log.Print(io.ReadAll(testing.Body))
	log.Fatal(server.App.Listen(":" + envConfig.Port))
}
