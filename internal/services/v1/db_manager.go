package servicesv1

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"sync"
	"sync/atomic"
	"time"

	dbv1 "sqlite-server/internal/protos/db/v1"
	"sqlite-server/internal/sqldrivers"
)

// DbManager handles the lifecycle of database connections, including:
// - Lazy Loading
// - Expirable LRU Caching
// - Dual Pools (ReadWrite vs ReadOnly)
// - Graceful Shutdown
type DbManager struct {
	configs   map[string]*dbv1.DatabaseConfig
	muConfigs sync.RWMutex

	// cacheRW for Read-Write connections (sync.Map for high concurrency)
	cacheRW sync.Map
	// cacheRO for Read-Only connections
	cacheRO sync.Map

	// LRU Config
	ttl time.Duration

	// Lifecycle management
	shutdownCh chan struct{}
	wg         sync.WaitGroup // Waits for background cleaner to exit
}

type cachedConnection struct {
	db *sql.DB
	// lastUsed is stored as Unix Nanoseconds to allow atomic updates
	lastUsed int64
	id       string // Key for logging/debugging
}

const (
	ModeRW = "rw"
	ModeRO = "ro"
)

// NewDbManager creates a new manager and optionally validates all configs.
func NewDbManager(configs []*dbv1.DatabaseConfig) *DbManager {
	mgr := &DbManager{
		configs: make(map[string]*dbv1.DatabaseConfig),
		// sync.Map zero value is valid, no make() needed
		ttl:        10 * time.Minute, // Default TTL
		shutdownCh: make(chan struct{}),
	}

	for _, cfg := range configs {
		mgr.configs[cfg.Name] = cfg
	}

	// Validate Access on Startup (Transient check)
	for _, cfg := range configs {
		if err := mgr.validateConnection(cfg); err != nil {
			log.Printf("WARNING: Failed to validate database %s: %v", cfg.Name, err)
		}
	}

	// Start Background Cleaner
	mgr.wg.Add(1)
	go mgr.runCleaner()

	return mgr
}

// Stop signals the background cleaner to exit, waits for it,
// and then closes all active connections.
func (m *DbManager) Stop() {
	// 1. Signal background routine to stop
	close(m.shutdownCh)

	// 2. Wait for background routine to finish (prevents test hangs)
	m.wg.Wait()

	// 3. Close actual connections
	m.CloseAll()
}

func (m *DbManager) CloseAll() {
	conns := []*sql.DB{}

	m.cacheRW.Range(func(key, value any) bool {
		k := key.(string)
		conn := value.(*cachedConnection)
		log.Printf("Closing database connection: %s", k)
		conns = append(conns, conn.db)
		m.cacheRW.Delete(key)
		return true
	})

	m.cacheRO.Range(func(key, value any) bool {
		k := key.(string)
		conn := value.(*cachedConnection)
		log.Printf("Closing database connection: %s", k)
		conns = append(conns, conn.db)
		m.cacheRO.Delete(key)
		return true
	})

	// Close outside of map iteration (though Range is concurrent safe, closing is heavy)
	for _, db := range conns {
		db.Close()
	}
}

// Mount adds a new database configuration.
func (m *DbManager) Mount(config *dbv1.DatabaseConfig) error {
	m.muConfigs.RLock()
	if _, exists := m.configs[config.Name]; exists {
		m.muConfigs.RUnlock()
		return fmt.Errorf("database '%s' already mounted", config.Name)
	}
	m.muConfigs.RUnlock()

	// 1. Validate before locking muConfigs (Ping can block)
	if err := m.validateConnection(config); err != nil {
		return err
	}

	m.muConfigs.Lock()
	defer m.muConfigs.Unlock()

	// Re-check existence
	if _, exists := m.configs[config.Name]; exists {
		return fmt.Errorf("database '%s' already mounted", config.Name)
	}

	m.configs[config.Name] = config
	return nil
}

// UpdateDatabase updates an existing database configuration and invalidates cached connections.
func (m *DbManager) UpdateDatabase(config *dbv1.DatabaseConfig) error {
	m.muConfigs.Lock()
	if _, exists := m.configs[config.Name]; !exists {
		m.muConfigs.Unlock()
		return fmt.Errorf("database '%s' not found", config.Name)
	}

	// Persist the update
	m.configs[config.Name] = config
	m.muConfigs.Unlock()

	// Invalidate Cache to force reload on next access
	m.invalidateCache(config.Name)

	return nil
}

// Unmount removes a database configuration and closes active connections.
func (m *DbManager) Unmount(name string) error {
	m.muConfigs.Lock()
	if _, exists := m.configs[name]; !exists {
		m.muConfigs.Unlock()
		return fmt.Errorf("database '%s' not found", name)
	}
	delete(m.configs, name)
	m.muConfigs.Unlock()

	// Remove connections from cache
	m.invalidateCache(name)

	return nil
}

// AttachDatabase adds a new attached database to an existing primary database.
func (m *DbManager) AttachDatabase(parentName string, attachment *dbv1.Attachment) error {
	m.muConfigs.Lock()
	config, ok := m.configs[parentName]
	if !ok {
		m.muConfigs.Unlock()
		return fmt.Errorf("database '%s' not found", parentName)
	}

	// Verify target database exists
	_, targetExists := m.configs[attachment.TargetDatabaseName]
	if !targetExists {
		m.muConfigs.Unlock()
		return fmt.Errorf("target database '%s' not found", attachment.TargetDatabaseName)
	}

	// Check if alias already exists
	for _, existing := range config.Attachments {
		if existing.Alias == attachment.Alias {
			m.muConfigs.Unlock()
			if existing.TargetDatabaseName == attachment.TargetDatabaseName {
				return nil
			}
			return fmt.Errorf("attachment alias '%s' already exists for database '%s'", attachment.Alias, parentName)
		}
	}

	config.Attachments = append(config.Attachments, attachment)
	m.muConfigs.Unlock()

	// Invalidate Cache to force reload (ATTACH happens at connection start)
	m.invalidateCache(parentName)

	return nil
}

// DetachDatabase removes an attached database from a primary database by its alias.
func (m *DbManager) DetachDatabase(parentName string, alias string) error {
	m.muConfigs.Lock()
	config, ok := m.configs[parentName]
	if !ok {
		m.muConfigs.Unlock()
		return fmt.Errorf("database '%s' not found", parentName)
	}

	found := false
	newAttachments := make([]*dbv1.Attachment, 0, len(config.Attachments))
	for _, existing := range config.Attachments {
		if existing.Alias == alias {
			found = true
			continue
		}
		newAttachments = append(newAttachments, existing)
	}

	if !found {
		m.muConfigs.Unlock()
		return fmt.Errorf("attachment alias '%s' not found for database '%s'", alias, parentName)
	}

	config.Attachments = newAttachments
	m.muConfigs.Unlock()

	// Invalidate Cache
	m.invalidateCache(parentName)

	return nil
}

func (m *DbManager) invalidateCache(name string) {
	log.Printf("Invalidating connection cache for database: %s", name)

	// 1. Close and remove RW connection
	if val, ok := m.cacheRW.LoadAndDelete(name); ok {
		val.(*cachedConnection).db.Close()
	}

	// 2. Close and remove RO connection
	if val, ok := m.cacheRO.LoadAndDelete(name); ok {
		val.(*cachedConnection).db.Close()
	}
}

// List returns the names of all mounted databases.
func (m *DbManager) List() []string {
	m.muConfigs.RLock()
	defer m.muConfigs.RUnlock()

	names := make([]string, 0, len(m.configs))
	for name := range m.configs {
		names = append(names, name)
	}
	return names
}

// GetConnection returns a connection for the given database and mode.
// It opens one if not found in cache.
func (m *DbManager) GetConnection(ctx context.Context, name string, mode string) (*sql.DB, error) {
	// 1. Fast Path: Check Cache First
	var cache *sync.Map
	if mode == ModeRO {
		cache = &m.cacheRO
	} else {
		cache = &m.cacheRW
	}

	if val, ok := cache.Load(name); ok {
		item := val.(*cachedConnection)
		// DEBOUNCED ATOMIC UPDATE: Only update if older than 1s
		// Reduces cache line contention on high RPS
		now := time.Now().UnixNano()
		if now-atomic.LoadInt64(&item.lastUsed) > int64(time.Second) {
			atomic.StoreInt64(&item.lastUsed, now)
		}
		return item.db, nil
	}

	// 2. Slow Path: Config Check & Creation
	m.muConfigs.RLock()
	config, ok := m.configs[name]
	m.muConfigs.RUnlock()

	if !ok {
		return nil, fmt.Errorf("database not found: %s", name)
	}

	// Check context before heavy work
	if ctx.Err() != nil {
		return nil, ctx.Err()
	}

	attachments := m.resolveAttachments(config)
	db, err := sqldrivers.NewSqliteDbWithAttachments(config, mode == ModeRO, attachments)
	if err != nil {
		return nil, err
	}

	// Verify it works
	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, err
	}

	// 3. Insert into Cache (LoadOrStore to handle race)

	// Create item wrapper
	newItem := &cachedConnection{
		db:       db,
		lastUsed: time.Now().UnixNano(),
		id:       name,
	}

	actual, loaded := cache.LoadOrStore(name, newItem)
	if loaded {
		// Another goroutine beat us to it. Close ours and use theirs.
		db.Close()
		item := actual.(*cachedConnection)
		// Update their timestamp since we wanted to use it
		atomic.StoreInt64(&item.lastUsed, time.Now().UnixNano())
		return item.db, nil
	}

	// We stored ours.
	return db, nil
}

func (m *DbManager) runCleaner() {
	defer m.wg.Done() // Signal that this goroutine has exited

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-m.shutdownCh:
			return
		case <-ticker.C:
			m.evictStale()
		}
	}
}

func (m *DbManager) evictStale() {
	now := time.Now().UnixNano()
	ttlNanos := m.ttl.Nanoseconds()
	toClose := []*sql.DB{}

	// 1. Mark RW for eviction
	m.cacheRW.Range(func(key, value any) bool {
		k := key.(string)
		item := value.(*cachedConnection)
		lastUsed := atomic.LoadInt64(&item.lastUsed)
		if (now - lastUsed) > ttlNanos {
			log.Printf("Evicting stale RW connection: %s", k)
			toClose = append(toClose, item.db)
			m.cacheRW.Delete(k)
		}
		return true
	})

	// 2. Mark RO for eviction
	m.cacheRO.Range(func(key, value any) bool {
		k := key.(string)
		item := value.(*cachedConnection)
		lastUsed := atomic.LoadInt64(&item.lastUsed)
		if (now - lastUsed) > ttlNanos {
			log.Printf("Evicting stale RO connection: %s", k)
			toClose = append(toClose, item.db)
			m.cacheRO.Delete(k)
		}
		return true
	})

	// 3. Perform Close outside map operations
	for _, db := range toClose {
		db.Close()
	}
}

func (m *DbManager) resolveAttachments(config *dbv1.DatabaseConfig) []sqldrivers.AttachmentInfo {
	m.muConfigs.RLock()
	defer m.muConfigs.RUnlock()

	var resolved []sqldrivers.AttachmentInfo
	for _, att := range config.Attachments {
		target, ok := m.configs[att.TargetDatabaseName]
		if !ok {
			log.Printf("WARNING: Atomic attachment failed: target database '%s' not found for parent '%s'", att.TargetDatabaseName, config.Name)
			continue
		}
		resolved = append(resolved, sqldrivers.AttachmentInfo{
			Alias:    att.Alias,
			Path:     target.DbPath,
			Key:      target.Key,
			ReadOnly: target.ReadOnly,
		})
	}
	return resolved
}

// validateConnection opens a transient connection to check config validity
func (m *DbManager) validateConnection(config *dbv1.DatabaseConfig) error {
	attachments := m.resolveAttachments(config)

	// Always validate as ReadWrite to ensure connectivity.
	db, err := sqldrivers.NewSqliteDbWithAttachments(config, false, attachments)
	if err != nil {
		return err
	}
	defer db.Close()

	// Use a timeout for validation so startup doesn't hang indefinitely
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return db.PingContext(ctx)
}
