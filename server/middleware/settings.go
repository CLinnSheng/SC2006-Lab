package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

func Settings(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Authorization, Content-Type, Origin, Accept", // List of request header that can be use when making a request
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
