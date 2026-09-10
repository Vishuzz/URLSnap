package store

import (
	"errors"
	"sync"
)

type InMemoryStore struct {
	mu     sync.RWMutex
	data   map[string]string
	clicks map[string]int64
}

func NewInMemoryStore() *InMemoryStore {
	return &InMemoryStore{
		data:   make(map[string]string),
		clicks: make(map[string]int64),
	}
}

func (m *InMemoryStore) SaveURL(originalURL string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	for i := 0; i < 5; i++ {
		code, err := GenerateCode(CodeLength)
		if err != nil {
			return "", err
		}
		if _, exists := m.data[code]; !exists {
			m.data[code] = originalURL
			m.clicks[code] = 0
			return code, nil
		}
	}
	return "", errors.New("failed to generate unique code")
}

func (m *InMemoryStore) GetURLAndIncrementClick(code string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	originalURL, exists := m.data[code]
	if !exists {
		return "", errors.New("short URL code not found")
	}

	m.clicks[code]++
	return originalURL, nil
}

func (m *InMemoryStore) Ping() error {
	return nil
}

func (m *InMemoryStore) Close() error {
	return nil
}
