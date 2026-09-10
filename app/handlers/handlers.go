package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"url-shortener/store"
)

type Server struct {
	Store   store.URLStore
	BaseURL string
}

type ShortenRequest struct {
	URL string `json:"url"`
}

type ShortenResponse struct {
	Code     string `json:"code"`
	ShortURL string `json:"short_url"`
}

type HealthResponse struct {
	Status   string `json:"status"`
	Database string `json:"database,omitempty"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func NewServer(s store.URLStore, baseURL string) *Server {
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}
	return &Server{
		Store:   s,
		BaseURL: strings.TrimRight(baseURL, "/"),
	}
}

func (srv *Server) ShortenHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ShortenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.URL) == "" {
		srv.writeJSONError(w, "Invalid request payload. 'url' is required.", http.StatusBadRequest)
		return
	}

	rawURL := strings.TrimSpace(req.URL)
	if !strings.HasPrefix(rawURL, "http://") && !strings.HasPrefix(rawURL, "https://") {
		rawURL = "http://" + rawURL
	}

	if _, err := url.ParseRequestURI(rawURL); err != nil {
		srv.writeJSONError(w, "Invalid URL format.", http.StatusBadRequest)
		return
	}

	code, err := srv.Store.SaveURL(rawURL)
	if err != nil {
		srv.writeJSONError(w, "Failed to shorten URL.", http.StatusInternalServerError)
		return
	}

	shortURL := fmt.Sprintf("%s/%s", srv.BaseURL, code)
	resp := ShortenResponse{
		Code:     code,
		ShortURL: shortURL,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func (srv *Server) RedirectHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	code := strings.TrimPrefix(r.URL.Path, "/")
	if code == "" || code == "health" || code == "shorten" {
		http.NotFound(w, r)
		return
	}

	originalURL, err := srv.Store.GetURLAndIncrementClick(code)
	if err != nil {
		srv.writeJSONError(w, "Short code not found", http.StatusNotFound)
		return
	}

	http.Redirect(w, r, originalURL, http.StatusFound)
}

func (srv *Server) HealthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	dbStatus := "connected"
	if srv.Store != nil {
		if err := srv.Store.Ping(); err != nil {
			dbStatus = "disconnected"
		}
	}

	resp := HealthResponse{
		Status:   "UP",
		Database: dbStatus,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func (srv *Server) writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}
