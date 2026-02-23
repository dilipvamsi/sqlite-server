package servicesv1

import (
	"context"
	"sync"
	"sync/atomic"
	"testing"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDbManager_Mount_BranchCoverage(t *testing.T) {
	mgr := NewDbManager(nil)
	defer mgr.Stop()

	config := &sqlrpcv1.DatabaseConfig{Name: "test_branch", DbPath: ":memory:"}

	// 1. Success
	err := mgr.Mount(config)
	assert.NoError(t, err)

	// 2. Duplicate (loads from sync.Map)
	err = mgr.Mount(config)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "already mounted")

	// 3. Validation failure branch
	invalidConfig := &sqlrpcv1.DatabaseConfig{Name: "invalid", DbPath: "/non/existent/path/to/db"}
	err = mgr.Mount(invalidConfig)
	assert.Error(t, err)
}

func TestDbManager_Update_BranchCoverage(t *testing.T) {
	mgr := NewDbManager(nil)
	defer mgr.Stop()

	// 1. Update non-existent
	err := mgr.UpdateDatabase(&sqlrpcv1.DatabaseConfig{Name: "missing"})
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "not found")

	// 2. Update success
	config := &sqlrpcv1.DatabaseConfig{Name: "updatable", DbPath: ":memory:"}
	mgr.Mount(config)
	config.ReadOnly = true
	err = mgr.UpdateDatabase(config)
	assert.NoError(t, err)
}

func TestDbManager_Attachment_BranchCoverage(t *testing.T) {
	mgr := NewDbManager(nil)
	defer mgr.Stop()

	// 1. Attach to missing parent
	err := mgr.AttachDatabase("missing", &sqlrpcv1.Attachment{})
	assert.Error(t, err)

	// 2. Attach missing target
	parent := &sqlrpcv1.DatabaseConfig{Name: "parent", DbPath: ":memory:"}
	mgr.Mount(parent)
	err = mgr.AttachDatabase("parent", &sqlrpcv1.Attachment{Alias: "a", TargetDatabaseName: "missing_target"})
	assert.Error(t, err)

	// 3. Attach success + Alias collision same
	target := &sqlrpcv1.DatabaseConfig{Name: "target", DbPath: ":memory:"}
	mgr.Mount(target)
	att := &sqlrpcv1.Attachment{Alias: "att1", TargetDatabaseName: "target"}
	err = mgr.AttachDatabase("parent", att)
	assert.NoError(t, err)

	// Same alias, same target -> No-op success
	err = mgr.AttachDatabase("parent", att)
	assert.NoError(t, err)

	// Same alias, different target -> Error
	otherTarget := &sqlrpcv1.DatabaseConfig{Name: "other", DbPath: ":memory:"}
	mgr.Mount(otherTarget)
	err = mgr.AttachDatabase("parent", &sqlrpcv1.Attachment{Alias: "att1", TargetDatabaseName: "other"})
	assert.Error(t, err)

	// 4. Detach branches
	// Parent missing
	err = mgr.DetachDatabase("non_existent", "att1")
	assert.Error(t, err)

	// Alias missing
	err = mgr.DetachDatabase("parent", "missing_alias")
	assert.Error(t, err)

	// Success
	err = mgr.DetachDatabase("parent", "att1")
	assert.NoError(t, err)
}

func TestDbManager_GetConnection_DebounceAndRace(t *testing.T) {
	mgr := NewDbManager(nil)
	defer mgr.Stop()

	config := &sqlrpcv1.DatabaseConfig{Name: "dbc", DbPath: ":memory:"}
	mgr.Mount(config)

	// 1. Hit cache
	_, err := mgr.GetConnection(context.Background(), "dbc", ModeRW)
	require.NoError(t, err)

	// Initial lastUsed
	val, _ := mgr.cacheRW.Load("dbc")
	item := val.(*cachedConnection)
	t1 := atomic.LoadInt64(&item.lastUsed)

	// Immediate sub-second call -> should NOT update lastUsed (debounced)
	_, _ = mgr.GetConnection(context.Background(), "dbc", ModeRW)
	t2 := atomic.LoadInt64(&item.lastUsed)
	assert.Equal(t, t1, t2, "Timestamp should have been debounced")

	// 2. Multi-goroutine collision in slow path
	mgr.Unmount("dbc") // Clear everything
	mgr.Mount(config)  // Mount again but cache is empty

	var wg sync.WaitGroup
	wg.Add(5)
	for i := 0; i < 5; i++ {
		go func() {
			defer wg.Done()
			_, _ = mgr.GetConnection(context.Background(), "dbc", ModeRW)
		}()
	}
	wg.Wait()
	// Should have only one connection in cache despite race
	count := 0
	mgr.cacheRW.Range(func(k, v any) bool {
		count++
		return true
	})
	assert.Equal(t, 1, count)
}

func TestDbManager_ResolveAttachments_WarningBranch(t *testing.T) {
	mgr := NewDbManager(nil)
	defer mgr.Stop()

	config := &sqlrpcv1.DatabaseConfig{
		Name:   "parent",
		DbPath: ":memory:",
		Attachments: []*sqlrpcv1.Attachment{
			{Alias: "ghost", TargetDatabaseName: "non_existent"},
		},
	}
	// Manual store to bypass Mount validation if possible, or just use the internal method
	resolved := mgr.resolveAttachments(config)
	assert.Len(t, resolved, 0, "Missing target should not be resolved")
}

func TestDbManager_EvictStale_Empty(t *testing.T) {
	mgr := NewDbManager(nil)
	defer mgr.Stop()
	// Should not panic or error on empty maps
	mgr.evictStale()
}
