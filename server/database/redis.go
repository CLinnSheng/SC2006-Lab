package database

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var RedisCtx = context.Background() // Empty Context

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Redis server address
		Password: "",               // No password set
		DB:       0,                // Use default DB
	})

	pong, err := RedisClient.Ping(RedisCtx).Result()
	if err != nil {
		log.Fatalf("Error connecting to Redis: %v", err)
	}
	log.Printf("Connected to Redis! Pong: %s", pong)

	// Flush the database on startup
	err = RedisClient.FlushDB(RedisCtx).Err()
	if err != nil {
		log.Printf("Error flushing Redis database: %v", err)
	} else {
		log.Println("Redis database flushed on startup.")
	}
}

func GetRedisClient() *redis.Client {
	return RedisClient
}

func GetRedisContext() context.Context {
	return RedisCtx
}

func CloseRedis() {
	if err := RedisClient.Close(); err != nil {
		log.Fatalf("Error closing Redis client: %v", err)
	}
	log.Println("Redis client closed.")
}
