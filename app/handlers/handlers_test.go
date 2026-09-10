package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
	"url-shortener/store"
)

type MockStore struct {
	mu     sync.Mutex
	data   map[string]string
	clicks map[string]int64
}

func NewMockStore() *MockStore {
	return &MockStore{
		data:   make(map[string]string),
		clicks: make(map[string]int64),
	}
}

func (m *MockStore) SaveURL(originalURL string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	code, err := store.GenerateCode(6)
	if err != nil {
		return "", err
	}
	m.data[code] = originalURL
	m.clicks[code] = 0
	return code, nil
}

func (m *MockStore) GetURLAndIncrementClick(code string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	url, exists := m.data[code]
	if !exists {
		return "", errors.New("not found")
	}
	m.clicks[code]++
	return url, nil
}

func (m *MockStore) Ping() error {
	return nil
}

func (m *MockStore) Close() error {
	return nil
}

func TestHealthHandler(t *testing.T) {
	mockStore := NewMockStore()
	srv := NewServer(mockStore, "http://localhost:8080")

	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	srv.HealthHandler(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var resp HealthResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse json response: %v", err)
	}

	if resp.Status != "UP" {
		t.Errorf("expected status UP, got %s", resp.Status)
	}
}

func TestShortenAndRedirectHandler(t *testing.T) {
	mockStore := NewMockStore()
	srv := NewServer(mockStore, "http://localhost:8080")

	// 1. Shorten URL
	payload := []byte(`{"url": "https://google.com"}`)
	req, err := http.NewRequest("POST", "/shorten", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	srv.ShortenHandler(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("ShortenHandler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}

	var shortResp ShortenResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &shortResp); err != nil {
		t.Fatalf("failed to unmarshal JSON response: %v", err)
	}

	if shortResp.Code == "" {
		t.Errorf("expected non-empty code")
	}

	// 2. Redirect URL
	redirectReq, err := http.NewRequest("GET", "/"+shortResp.Code, nil)
	if err != nil {
		t.Fatal(err)
	}

	rrRedirect := httptest.NewRecorder()
	srv.RedirectHandler(rrRedirect, redirectReq)

	if status := rrRedirect.Code; status != http.StatusFound {
		t.Errorf("RedirectHandler returned wrong status code: got %v want %v", status, http.StatusFound)
	}

	location := rrRedirect.Header().Get("Location")
	if location != "https://google.com" {
		t.Errorf("expected redirect location https://google.com, got %s", location)
	}

	// Verify atomic click increment in mock
	if mockStore.clicks[shortResp.Code] != 1 {
		t.Errorf("expected click count 1, got %d", mockStore.clicks[shortResp.Code])
	}
}
