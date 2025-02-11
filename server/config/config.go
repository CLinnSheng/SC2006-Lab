package config

import (
	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
	"log"
)

type EnvConfig struct {
	Port string `env:"PORT,required"`
	// DBHost     string `env:"DB_HOST,required"`
	// DBName     string `env:"DB_NAME,required"`
	// DBUser     string `env:"DB_USER,required"`
	// DBPassword string `env:"DB_PASSWORD,required"`
	// DBSSLMode  string `env:"DB_SSL_MODE,required"`
}

func GetEnvConfig() *EnvConfig {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Fail to load dotenv file %e", err)
	}

	envConfig := &EnvConfig{}
	if err := env.Parse(envConfig); err != nil {
		log.Fatalf("Unable to load variables from dotenv file %e", err)
	}

	return envConfig
}
