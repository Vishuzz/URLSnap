package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"url-shortener/handlers"
	"url-shortener/store"
)

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return fallback
}

func main() {
	port := getEnv("PORT", "8080")
	baseURL := getEnv("BASE_URL", fmt.Sprintf("http://localhost:%s", port))

	dbUser := getEnv("DB_USER", "urluser")
	dbPass := getEnv("DB_PASSWORD", "urlpass123")
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "urlshortener")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPass, dbHost, dbPort, dbName)

	var urlStore store.URLStore
	var err error

	// Retry connection to DB (useful when DB is starting up in container/EC2)
	maxRetries := 10
	for i := 1; i <= maxRetries; i++ {
		log.Printf("Connecting to MySQL (Attempt %d/%d)...", i, maxRetries)
		urlStore, err = store.NewMySQLStore(dsn)
		if err == nil {
			log.Println("Successfully connected to MySQL database!")
			break
		}
		log.Printf("Database connection attempt failed: %v", err)
		if i == maxRetries {
			log.Printf("WARNING: Could not connect to MySQL. Starting server in degraded/standalone mode for testing.")
		} else {
			time.Sleep(3 * time.Second)
		}
	}

	server := handlers.NewServer(urlStore, baseURL)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", server.HealthHandler)
	mux.HandleFunc("/shorten", server.ShortenHandler)
	mux.HandleFunc("/", server.RedirectHandler)

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Starting URL Shortener server on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
