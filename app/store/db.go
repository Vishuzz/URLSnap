package store

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type URLRecord struct {
	ID          int64     `json:"id"`
	Code        string    `json:"code"`
	OriginalURL string    `json:"original_url"`
	ClickCount  int64     `json:"click_count"`
	CreatedAt   time.Time `json:"created_at"`
}

type URLStore interface {
	SaveURL(originalURL string) (string, error)
	GetURLAndIncrementClick(code string) (string, error)
	Ping() error
	Close() error
}

type MySQLStore struct {
	db *sql.DB
}

func NewMySQLStore(dsn string) (*MySQLStore, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	store := &MySQLStore{db: db}
	if err := store.autoMigrate(); err != nil {
		return nil, fmt.Errorf("failed to run auto migration: %w", err)
	}

	return store, nil
}

func (s *MySQLStore) autoMigrate() error {
	query := `
	CREATE TABLE IF NOT EXISTS urls (
		id INT AUTO_INCREMENT PRIMARY KEY,
		code VARCHAR(10) NOT NULL UNIQUE,
		original_url TEXT NOT NULL,
		click_count INT DEFAULT 0,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	`
	_, err := s.db.Exec(query)
	return err
}

func (s *MySQLStore) SaveURL(originalURL string) (string, error) {
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		code, err := GenerateCode(CodeLength)
		if err != nil {
			return "", err
		}

		query := `INSERT INTO urls (code, original_url) VALUES (?, ?)`
		_, err = s.db.Exec(query, code, originalURL)
		if err == nil {
			return code, nil
		}
		// If duplicate key error, retry loop
	}
	return "", errors.New("failed to generate unique code after maximum retries")
}

func (s *MySQLStore) GetURLAndIncrementClick(code string) (string, error) {
	// Atomic update of click count
	updateQuery := `UPDATE urls SET click_count = click_count + 1 WHERE code = ?`
	res, err := s.db.Exec(updateQuery, code)
	if err != nil {
		return "", fmt.Errorf("failed to update click count: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil || rowsAffected == 0 {
		return "", errors.New("short URL code not found")
	}

	// Fetch original URL
	var originalURL string
	selectQuery := `SELECT original_url FROM urls WHERE code = ?`
	err = s.db.QueryRow(selectQuery, code).Scan(&originalURL)
	if err != nil {
		return "", fmt.Errorf("failed to fetch original url: %w", err)
	}

	return originalURL, nil
}

func (s *MySQLStore) Ping() error {
	return s.db.Ping()
}

func (s *MySQLStore) Close() error {
	return s.db.Close()
}
