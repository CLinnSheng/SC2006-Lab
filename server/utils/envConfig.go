package utils

import (
	"log"
	"sync"

	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
)

type EnvConfig struct {
	PORT string `env:"PORT,required"`
	// DBHost     string `env:"DB_HOST,required"`
	// DBName     string `env:"DB_NAME,required"`
	// DBUser     string `env:"DB_USER,required"`
	// DBPassword string `env:"DB_PASSWORD,required"`
	// DBSSLMode  string `env:"DB_SSL_MODE,required"`
	LTA_ACCOUNT_KEY string `env:"LTA_ACCOUNT_KEY,required"`
	GOOGLE_API_KEY string `env:"GOOGLE_API_KEY,required"`
	URA_ACCESS_KEY string `env:"URA_ACCESS_KEY,required"`
}

var (
	envConfig *EnvConfig
	once      sync.Once
)

func GetEnvConfig() *EnvConfig {
	once.Do(func() {
		err := godotenv.Load()
		if err != nil {
			log.Printf("Error loading .env file: %e", err)
		}

		envConfig = &EnvConfig{}
		if err := env.Parse(envConfig); err != nil {
			log.Fatalf("Unable to load environment variables: %e", err)
		}
		log.Println("Environment configuration loaded.")
	})
	return envConfig
}

// Optional: Function to access specific config values without calling GetEnvConfig() repeatedly
func GetPort() string {
	cfg := GetEnvConfig()
	return cfg.PORT
}

func GetLTAAccountKey() string {
	cfg := GetEnvConfig()
	return cfg.LTA_ACCOUNT_KEY
}

func GetGoogleApiKey() string {
	cfg := GetEnvConfig()
	return cfg.GOOGLE_API_KEY
}

func GetURAAccessKey() string {
	cfg := GetEnvConfig()
	return cfg.URA_ACCESS_KEY
}