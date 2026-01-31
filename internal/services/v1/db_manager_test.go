package servicesv1

import (
	"context"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	dbv1 "sqlite-server/internal/protos/db/v1"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDbManager_EvictStale(t *testing.T) {
	// 1. Setup Manager with one DB
	config := &dbv1.DatabaseConfig{
		Name:   "test_evict",
		DbPath: ":memory:",
	}
	mgr := NewDbManager([]*dbv1.DatabaseConfig{config})
	defer mgr.Stop()

	// 2. Open Connection (Populate Cache)
	// We need context to call GetConnection
	// servicesv1 package doesn't verify auth in GetConnection, only in Interceptors.
	// But NewDbManager uses context.Background() in constructor for validation.
	// Let's use context.Background()

	// Wait, we need to make sure the connection is created.
	// GetConnection is public.
	_, err := mgr.GetConnection(context.Background(), "test_evict", ModeRW)
	require.NoError(t, err)

	// Verify it's in cache
	val, exists := mgr.cacheRW.Load("test_evict")
	require.True(t, exists, "Connection should be in cacheRW")

	// 3. Manually age the connection
	// Access the cached item
	item := val.(*cachedConnection)

	// Set lastUsed to 20 minutes ago (TTL is 10 mins)
	staleTime := time.Now().Add(-20 * time.Minute).UnixNano()
	atomic.StoreInt64(&item.lastUsed, staleTime)

	// 4. Trigger Eviction
	mgr.evictStale()

	// 5. Verify it's gone
	_, exists = mgr.cacheRW.Load("test_evict")
	assert.False(t, exists, "Connection should have been evicted")
}

func TestUnmount(t *testing.T) {
	// 1. Setup
	config := &dbv1.DatabaseConfig{Name: "test_unmount", DbPath: ":memory:"}
	mgr := NewDbManager([]*dbv1.DatabaseConfig{config})
	defer mgr.Stop()

	// 2. Unmount existing
	err := mgr.Unmount("test_unmount")
	assert.NoError(t, err)

	// 3. Unmount non-existent
	err = mgr.Unmount("test_unmount")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "not found")
}

func TestGetConnection_Errors(t *testing.T) {
	mgr := NewDbManager(nil)
	defer mgr.Stop()

	// 1. Non-existent DB
	_, err := mgr.GetConnection(context.Background(), "missing_db", ModeRW)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "database not found")

	// 2. Context Cancelled
	ctx, cancel := context.WithCancel(context.Background())
	cancel() // Cancel immediately
	// Use a valid config so we hit the context check, not the config check
	config := &dbv1.DatabaseConfig{Name: "test_cancel", DbPath: ":memory:"}
	mgrWithConfig := NewDbManager([]*dbv1.DatabaseConfig{config})
	defer mgrWithConfig.Stop()

	_, err = mgrWithConfig.GetConnection(ctx, "test_cancel", ModeRW)
	require.Error(t, err)
	assert.Equal(t, context.Canceled, err)
}

func TestDbManager_EvictStale_RO(t *testing.T) {
	// 1. Setup Manager with RO config
	config := &dbv1.DatabaseConfig{
		Name:   "test_evict_ro",
		DbPath: ":memory:",
	}
	mgr := NewDbManager([]*dbv1.DatabaseConfig{config})
	defer mgr.Stop()

	// 2. Open RO Connection
	_, err := mgr.GetConnection(context.Background(), "test_evict_ro", ModeRO)
	require.NoError(t, err)

	// Verify it's in RO cache
	val, exists := mgr.cacheRO.Load("test_evict_ro")
	require.True(t, exists, "Connection should be in cacheRO")

	// 3. Manually age it
	item := val.(*cachedConnection)
	staleTime := time.Now().Add(-20 * time.Minute).UnixNano()
	atomic.StoreInt64(&item.lastUsed, staleTime)

	// 4. Evict
	mgr.evictStale()

	// 5. Verify gone
	_, exists = mgr.cacheRO.Load("test_evict_ro")
	assert.False(t, exists, "Connection should have been evicted from RO cache")
}

func TestGetConnection_Race(t *testing.T) {
	config := &dbv1.DatabaseConfig{Name: "race", DbPath: ":memory:"}
	mgr := NewDbManager([]*dbv1.DatabaseConfig{config})
	defer mgr.Stop()

	var wg sync.WaitGroup
	n := 20
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			defer wg.Done()
			_, _ = mgr.GetConnection(context.Background(), "race", ModeRW)
		}()
	}
	wg.Wait()
}

func TestGetConnection_PingFailure(t *testing.T) {
	tmpDir := t.TempDir()
	dirPath := filepath.Join(tmpDir, "not_a_file")
	err := os.Mkdir(dirPath, 0755)
	require.NoError(t, err)

	config := &dbv1.DatabaseConfig{Name: "ping_fail", DbPath: dirPath}
	mgr := NewDbManager([]*dbv1.DatabaseConfig{config})
	defer mgr.Stop()

	_, err = mgr.GetConnection(context.Background(), "ping_fail", ModeRW)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "is a directory")
}
