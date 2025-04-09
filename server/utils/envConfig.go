package utils

import (
	"log"
	"sync"

	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
)

type EnvConfig struct {
	PORT            string `env:"PORT,required"`
	LTA_ACCOUNT_KEY string `env:"LTA_ACCOUNT_KEY,required"`
	URA_ACCESS_KEY  string `env:"URA_ACCESS_KEY,required"`
	ONEMAP_EMAIL    string `env:"ONEMAP_EMAIL,required"`
	ONEMAP_PASSWORD string `env:"ONEMAP_PASSWORD,required"`
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

func GetLTA_AccountKey() string {
	cfg := GetEnvConfig()
	return cfg.LTA_ACCOUNT_KEY
}

func GetURA_AccessKey() string {
	cfg := GetEnvConfig()
	return cfg.URA_ACCESS_KEY
}

func GetOneMap_Email() string {
	cfg := GetEnvConfig()
	return cfg.ONEMAP_EMAIL
}

func GetOneMap_Password() string {
	cfg := GetEnvConfig()
	return cfg.ONEMAP_PASSWORD
}
