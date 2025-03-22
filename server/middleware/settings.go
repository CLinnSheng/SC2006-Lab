package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

type Server struct {
	App *fiber.App
}

func NewServer() *Server {
	return &Server{
		App: fiber.New(fiber.Config{
			AppName:       "SweetSpot v1.0",
			ServerHeader:  "Fiber",
			CaseSensitive: true,
		}),
	}
}

func Settings(app *fiber.App) {
	app.Use(func(c *fiber.Ctx) error {
		protocol := c.Protocol()
		log.Printf("Incoming request: %s %s", protocol, c.OriginalURL())
		return c.Next()
	})
	
	app.Use(cors.New(cors.Config{
		AllowHeaders: "Authorization, Content-Type, Origin, Accept", // List of request header that can be use when making a request
		AllowOrigins: "*",
	}),
		limiter.New(limiter.Config{
			Max:        100,
			Expiration: 30 * time.Second,
		}),
		func(c *fiber.Ctx) error {
			c.Accepts("application/json")
			return c.Next()
		})
}
