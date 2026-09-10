package store

import (
	"crypto/rand"
	"errors"
	"math/big"
)

const Base62Alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const CodeLength = 6

// GenerateCode generates a random Base62 string of specified length
func GenerateCode(length int) (string, error) {
	if length <= 0 {
		return "", errors.New("code length must be greater than zero")
	}

	result := make([]byte, length)
	alphabetLen := big.NewInt(int64(len(Base62Alphabet)))

	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, alphabetLen)
		if err != nil {
			return "", err
		}
		result[i] = Base62Alphabet[n.Int64()]
	}

	return string(result), nil
}
