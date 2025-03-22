package main

import (
	"log"

	"github.com/SC2006-Lab/MobileAppProject/external_services"
	"github.com/SC2006-Lab/MobileAppProject/middleware"
	"github.com/SC2006-Lab/MobileAppProject/utils"
	"github.com/gofiber/fiber/v2"
)

func main() {
	log.Print("Loading dotenv file")
	envConfig := utils.GetEnvConfig()

	server := middleware.NewServer()
	middleware.Settings(server.App)

	server.App.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("TESTING")
	})

	go func() {
		log.Printf("Starting server on port %s", envConfig.Port)
		if err := server.App.Listen(":" + envConfig.Port); err != nil {
			log.Fatalf("Error starting server %e", err)
		}	
	}()

	external_services.GetDataGovDataWeather()
	external_services.InitCarParkInformation()

	select{}
}
