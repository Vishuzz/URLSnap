package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	// DSN with 5 second connection timeout to prevent blocking server startup
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&timeout=5s&readTimeout=5s&writeTimeout=5s", dbUser, dbPass, dbHost, dbPort, dbName)

	var urlStore store.URLStore
	var err error

	log.Printf("Connecting to MySQL at %s:%s...", dbHost, dbPort)
	urlStore, err = store.NewMySQLStore(dsn)
	if err == nil {
		log.Println("Successfully connected to MySQL database!")
	} else {
		log.Printf("Could not connect to MySQL (%v).", err)
		log.Println("--> Falling back to In-Memory Store for fast health startup.")
		urlStore = store.NewInMemoryStore()
	}

	server := handlers.NewServer(urlStore, baseURL)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", server.HealthHandler)
	mux.HandleFunc("/shorten", server.ShortenHandler)
	mux.HandleFunc("/", server.RedirectHandler)

	handler := corsMiddleware(mux)

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Starting URL Shortener server on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
