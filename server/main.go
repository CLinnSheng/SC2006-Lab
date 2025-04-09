package main

import (
	"log"
	_ "log"
	"os"
	"os/signal"
	"syscall"

	"github.com/SC2006-Lab/MobileAppProject/api"
	"github.com/SC2006-Lab/MobileAppProject/data"
	"github.com/SC2006-Lab/MobileAppProject/middleware"
	"github.com/SC2006-Lab/MobileAppProject/database"
	"github.com/gofiber/fiber/v2"
)

func main() {

	apiData := data.NewApiData()
	apiData.Init()
	database.InitRedis()
	server := middleware.NewServer()

	api.SetupRoutes(server.App, apiData)
	server.App.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("TESTING")
	})

	go func() { server.Init() }()

	defer func(){
		database.CloseRedis()
		log.Println("Server closed.")
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

}
