package middleware

import (
	"log"
	"time"

	"github.com/SC2006-Lab/MobileAppProject/utils"
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

func (server *Server) Init() {
	log.Print("Loading dotenv file")
	envConfig := utils.GetEnvConfig()

	Settings(server.App)

	log.Printf("Starting server on port %s", envConfig.PORT)
	if err := server.App.Listen("0.0.0.0:" + envConfig.PORT); err != nil {
		log.Fatalf("Error starting server %e", err)
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
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
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
