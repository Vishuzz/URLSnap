package store

import (
	"strings"
	"testing"
)

func TestGenerateCode(t *testing.T) {
	t.Run("valid length generation", func(t *testing.T) {
		length := 6
		code, err := GenerateCode(length)
		if err != nil {
			t.Fatalf("expected no error, got: %v", err)
		}
		if len(code) != length {
			t.Errorf("expected length %d, got %d", length, len(code))
		}
		for _, char := range code {
			if !strings.ContainsRune(Base62Alphabet, char) {
				t.Errorf("character %c not in base62 alphabet", char)
			}
		}
	})

	t.Run("uniqueness across multiple calls", func(t *testing.T) {
		codes := make(map[string]bool)
		count := 1000
		for i := 0; i < count; i++ {
			code, err := GenerateCode(6)
			if err != nil {
				t.Fatalf("error generating code: %v", err)
			}
			if codes[code] {
				t.Errorf("duplicate code detected: %s", code)
			}
			codes[code] = true
		}
	})

	t.Run("invalid length", func(t *testing.T) {
		_, err := GenerateCode(0)
		if err == nil {
			t.Error("expected error for length <= 0, got nil")
		}
		_, err = GenerateCode(-5)
		if err == nil {
			t.Error("expected error for length <= 0, got nil")
		}
	})
}
