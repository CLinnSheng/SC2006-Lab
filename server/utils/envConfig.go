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
	REDIS_ADDRESS   string `env:"REDIS_ADDRESS,required"`
	REDIS_PASSWORD  string `env:"REDIS_PASSWORD,required"`
	REDIS_DB        int    `env:"REDIS_DB,required"`
	REDIS_PORT      string `env:"REDIS_PORT,required"`
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
