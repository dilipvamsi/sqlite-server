package servicesv1

import (
	"crypto/rand"
	"fmt"
	"net/http"
	"time"
	"unsafe"
)

// ===================================================================================
// Internal Helpers
// ===================================================================================

// genRequestID creates a Version 7 UUID (time-ordered) as defined in RFC 9562.
//
// WHY UUIDv7?
// Unlike random UUIDv4, v7 is time-ordered (Unix Timestamp Milliseconds).
// This makes logs easier to sort chronologically and significantly improves
// database indexing performance if these IDs are ever stored as primary keys.
//
// IMPLEMENTATION:
// We strictly follow the bit-layout defined in the RFC without importing
// external libraries like 'google/uuid' to keep the service lightweight.
func genRequestID() string {
	var b [16]byte

	// 1. Fill with cryptographically secure random bytes
	// We read 16 bytes first to cover the "rand_a" and "rand_b" fields.
	if _, err := rand.Read(b[:]); err != nil {
		// Fallback for extreme theoretical edge cases (e.g. OS entropy failure),
		// ensuring we never crash just because we couldn't make an ID.
		return fmt.Sprintf("fallback-%d", time.Now().UnixNano())
	}

	// 2. Encode Unix Timestamp (48 bits) into the first 6 bytes (Big Endian)
	// UUIDv7 uses milliseconds since Unix Epoch.
	ts := uint64(time.Now().UnixMilli())
	b[0] = byte(ts >> 40)
	b[1] = byte(ts >> 32)
	b[2] = byte(ts >> 24)
	b[3] = byte(ts >> 16)
	b[4] = byte(ts >> 8)
	b[5] = byte(ts)

	// 3. Set Version (0111 = 7) in the high 4 bits of octet 6
	// We preserve the lower 4 random bits (part of rand_a).
	b[6] = (b[6] & 0x0F) | 0x70

	// 4. Set Variant (10xx) in the high 2 bits of octet 8
	// We preserve the lower 6 random bits (part of rand_b).
	b[8] = (b[8] & 0x3F) | 0x80

	// 5. Return canonical string representation (8-4-4-4-12)
	// Example: 018c6b1a-2b30-7980-9c23-456789abcdef
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}

// ensureRequestID retrieves the X-Request-Id from headers or generates a new one.
// Returns the final ID to be used for logging and response headers.
func ensureRequestID(headers http.Header) string {
	id := headers.Get(headerRequestID)
	if id == "" {
		return genRequestID()
	}
	return id
}

// UnsafeStringToBytesNoCopy converts a string to a byte slice without allocation.
//
// PERFORMANCE:
// Standard `[]byte(str)` allocates new memory and copies the data.
// This function relies on `unsafe` to reuse the string's underlying data array.
//
// SAFETY WARNING:
// The returned byte slice is immutable. Attempting to modify it will panic or corrupt memory.
func UnsafeStringToBytesNoCopy(s string) []byte {
	return unsafe.Slice(unsafe.StringData(s), len(s))
}
