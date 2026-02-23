package pubsub

import (
	"database/sql"
	"fmt"
	"log"
	"sync"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// MsgPayload represents the internal structure of a single Pub/Sub message.
// It maps to the schema of the 'messages' table in the broker database.
type MsgPayload struct {
	ID      int64
	Channel string
	Payload string
	DbName  string
}

// RequestResult is used to pass the result of a batch publish operation
// back to the caller asynchronously.
type RequestResult struct {
	Done chan []int64 // Channel that receives the IDs of the newly published messages
}

// PubRequest represents a request to publish one or more messages to a specific database.
// These requests are queued and processed in batches by the broker.
type PubRequest struct {
	DbName string
	Items  []MsgPayload
	Result *RequestResult
}

var (
	resultPool  = sync.Pool{New: func() any { return &RequestResult{Done: make(chan []int64, 1)} }}
	requestPool = sync.Pool{New: func() any { return &PubRequest{Items: make([]MsgPayload, 0, 100)} }}
)

// Broker manages the Pub/Sub system, including persisting messages to SQLite,
// handling durable subscriptions, and broadcasting live signals to active listeners.
type Broker struct {
	database          *sql.DB                      // The dedicated SQLite database connection for the broker
	waitersMutex      sync.RWMutex                 // Mutex to protect concurrent access to the waiters map
	waiters           map[string][]chan MsgPayload // Map of subscription keys (dbName:channel) to lists of listener channels
	publishQueue      chan *PubRequest             // Channel used to queue incoming publish requests for batching
	messageTTL        time.Duration                // Time-to-live for messages in the database before they are pruned
	shutdownCh        chan struct{}                // Channel used to signal background goroutines to stop
	backgroundWorkers sync.WaitGroup               // WaitGroup to ensure background tasks finish
}

// NewBroker initializes the Pub/Sub broker with a dedicated SQLite database.
func NewBroker(path string, ttlHours int) (*Broker, error) {
	database, err := sql.Open("sqlite3", fmt.Sprintf("file:%s?_busy_timeout=10000&_journal=WAL", path))
	if err != nil {
		return nil, err
	}
	database.SetMaxOpenConns(25)

	// Setup high-performance durable schema
	_, err = database.Exec(`
		PRAGMA synchronous = NORMAL;
		PRAGMA temp_store = MEMORY;

		CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			db_source TEXT,
			channel TEXT,
			payload TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS subscriptions (
			name TEXT,
			db_name TEXT,
			channel TEXT,
			last_id INTEGER DEFAULT 0,
			last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (name, db_name, channel)
		);
		CREATE INDEX IF NOT EXISTS idx_broker_lookup ON messages (db_source, channel, id);
		CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
	`)
	if err != nil {
		database.Close()
		return nil, err
	}

	broker := &Broker{
		database:     database,
		waiters:      make(map[string][]chan MsgPayload),
		publishQueue: make(chan *PubRequest, 4096),
		messageTTL:   time.Duration(ttlHours) * time.Hour,
		shutdownCh:   make(chan struct{}),
	}

	broker.backgroundWorkers.Add(2)
	go broker.startBatcher()
	go broker.startPruner()

	return broker, nil
}

func (broker *Broker) Stop() {
	log.Println("[Broker] Stop() called, shutting down...")
	close(broker.shutdownCh)        // Stop the pruner and signal batcher
	broker.backgroundWorkers.Wait() // Wait for batcher to drain and pruner to exit
	broker.database.Close()
	log.Println("[Broker] Stop() completed.")
}

// startBatcher is a background goroutine that processes the publish queue.
// It groups multiple PubRequests into a single database transaction (batch)
// to significantly improve write performance to the underlying SQLite database.
func (broker *Broker) startBatcher() {
	log.Println("[DEBUG] Batcher goroutine started")
	defer broker.backgroundWorkers.Done()
	ticker := time.NewTicker(10 * time.Millisecond)
	defer ticker.Stop()
	batch := make([]*PubRequest, 0, 100)

	drainAndExit := func() {
		// Final drain of the queue
		for {
			select {
			case req := <-broker.publishQueue:
				batch = append(batch, req)
				if len(batch) >= 100 {
					broker.flush(batch)
					batch = batch[:0]
				}
			default:
				if len(batch) > 0 {
					broker.flush(batch)
				}
				return
			}
		}
	}

	for {
		select {
		case <-broker.shutdownCh:
			drainAndExit()
			return
		case req := <-broker.publishQueue:
			batch = append(batch, req)
			if len(batch) >= 100 {
				log.Printf("[DEBUG] Batcher flushing %d requests (batch full)", len(batch))
				broker.flush(batch)
				batch = batch[:0]
			}
		case <-ticker.C:
			if len(batch) > 0 {
				log.Printf("[DEBUG] Batcher flushing %d requests (ticker)", len(batch))
				broker.flush(batch)
				batch = batch[:0]
			}
		}
	}
}

// flush executes a batch of PubRequests within a single SQLite transaction.
// After successfully committing to the database, it broadcasts the new messages
// to any active live listeners (Signal Hub) and unblocks the original callers.
func (broker *Broker) flush(batch []*PubRequest) {
	log.Printf("[DEBUG] Entering flush with %d requests", len(batch))
	defer log.Printf("[DEBUG] Exicting flush")

	unblockAll := func() {
		for _, req := range batch {
			req.Result.Done <- nil
		}
	}

	transaction, err := broker.database.Begin()
	if err != nil {
		log.Printf("[ERROR] [Broker] Failed to begin transaction: %v", err)
		unblockAll()
		return
	}
	log.Printf("[DEBUG] Transaction started")
	insertStatement, err := transaction.Prepare("INSERT INTO messages (db_source, channel, payload) VALUES (?, ?, ?)")
	if err != nil {
		log.Printf("[Broker] Failed to prepare statement: %v", err)
		transaction.Rollback()
		unblockAll()
		return
	}
	defer insertStatement.Close()

	type resultSignal struct {
		req    *PubRequest
		result *RequestResult
		ids    []int64
	}
	signals := make([]resultSignal, 0, len(batch))

	for _, req := range batch {
		ids := make([]int64, 0, len(req.Items))
		for i := range req.Items {
			sqlResult, err := insertStatement.Exec(req.DbName, req.Items[i].Channel, req.Items[i].Payload)
			if err != nil {
				log.Printf("[Broker] Failed to exec: %v", err)
				continue
			}
			insertedID, _ := sqlResult.LastInsertId()
			ids = append(ids, insertedID)
		}
		signals = append(signals, resultSignal{req: req, result: req.Result, ids: ids})
	}

	log.Printf("[DEBUG] Committing transaction")
	if err := transaction.Commit(); err != nil {
		log.Printf("[ERROR] [Broker] Failed to commit: %v", err)
		unblockAll()
		return
	}
	log.Printf("[DEBUG] Transaction committed")

	// Unblock all callers AFTER successful commit AND broadcast live signals
	for _, sig := range signals {
		// Broadcast to live listeners to bypass DB reads.
		// MUST be done BEFORE unblocking caller, because the caller will immediately
		// return `sig.req` to the `sync.Pool`, mutating the `Items` slice.
		for i, id := range sig.ids {
			broker.broadcast(sig.req.DbName, sig.req.Items[i].Channel, MsgPayload{
				ID:      id,
				Channel: sig.req.Items[i].Channel,
				Payload: sig.req.Items[i].Payload,
				DbName:  sig.req.DbName,
			})
		}
		sig.result.Done <- sig.ids
	}
	log.Printf("[DEBUG] Exiting flush")
}

// broadcast sends a live message to all active listeners currently subscribed
// to the specified database and channel. This is part of the "Signal Hub"
// mechanism that bypasses standard database polling for real-time delivery.
func (broker *Broker) broadcast(databaseName, channelName string, messageData MsgPayload) {
	subscriptionKey := fmt.Sprintf("%s:%s", databaseName, channelName)
	broker.waitersMutex.RLock()
	defer broker.waitersMutex.RUnlock()
	if subscriberList, ok := broker.waiters[subscriptionKey]; ok {
		for _, subscriberChan := range subscriberList {
			select {
			case subscriberChan <- messageData:
			default:
				// Buffer full, subscriber might be slow
			}
		}
	}
}

// SubscribeSignal adds a live channel listener
func (broker *Broker) SubscribeSignal(databaseName, channelName string) (chan MsgPayload, func()) {
	subscriptionKey := fmt.Sprintf("%s:%s", databaseName, channelName)
	broker.waitersMutex.Lock()
	defer broker.waitersMutex.Unlock()

	subscriberChan := make(chan MsgPayload, 100)
	broker.waiters[subscriptionKey] = append(broker.waiters[subscriptionKey], subscriberChan)

	cleanupCallback := func() {
		broker.waitersMutex.Lock()
		defer broker.waitersMutex.Unlock()
		for index, existingChan := range broker.waiters[subscriptionKey] {
			if existingChan == subscriberChan {
				broker.waiters[subscriptionKey] = append(broker.waiters[subscriptionKey][:index], broker.waiters[subscriptionKey][index+1:]...)
				break
			}
		}
	}
	return subscriberChan, cleanupCallback
}

// Publish queues a batch of messages for asynchronous publishing.
// It uses sync.Pool for request/result objects to minimize allocations.
// The method blocks until the batch is committed by the background batcher
// and returns the IDs of the newly inserted messages.
func (broker *Broker) Publish(databaseName string, items []MsgPayload) []int64 {
	log.Printf("[DEBUG] Publish called for %s with %d items", databaseName, len(items))
	pubReq := requestPool.Get().(*PubRequest)
	reqRes := resultPool.Get().(*RequestResult)
	pubReq.DbName, pubReq.Result = databaseName, reqRes
	pubReq.Items = pubReq.Items[:0]
	pubReq.Items = append(pubReq.Items, items...)

	broker.publishQueue <- pubReq
	log.Printf("[DEBUG] Publish request queued")
	publishedIDs := <-reqRes.Done
	log.Printf("[DEBUG] Publish result received")
	resultPool.Put(reqRes)

	// Fix: Return pubReq to pool
	requestPool.Put(pubReq)

	return publishedIDs
}

func (broker *Broker) startPruner() {
	log.Println("[DEBUG] Pruner goroutine started")
	defer broker.backgroundWorkers.Done()
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-broker.shutdownCh:
			return
		case <-ticker.C:
			broker.prune()
		}
	}
}

func (broker *Broker) prune() {
	// 1. Prune messages older than TTL
	deleteResult, err := broker.database.Exec("DELETE FROM messages WHERE created_at < datetime('now', ?)", fmt.Sprintf("-%d hours", int(broker.messageTTL.Hours())))
	if err != nil {
		log.Printf("[Broker] Failed to prune messages: %v", err)
	} else {
		if deletedCount, _ := deleteResult.RowsAffected(); deletedCount > 0 {
			log.Printf("[Broker] Pruned %d old messages", deletedCount)
		}
	}

	// 2. Prune old subscriptions (inactive for 30 days)
	deleteSubResult, err := broker.database.Exec("DELETE FROM subscriptions WHERE last_active < datetime('now', '-30 days')")
	if err != nil {
		log.Printf("[Broker] Failed to prune subscriptions: %v", err)
	} else {
		if deletedCount, _ := deleteSubResult.RowsAffected(); deletedCount > 0 {
			log.Printf("[Broker] Pruned %d inactive subscriptions", deletedCount)
		}
	}
}

func (broker *Broker) GetDB() *sql.DB {
	return broker.database
}

// UpdateSubscription updates or creates the persistent offset (last_id)
// for a specific subscription (identified by name, db_name, and channel).
// This ensures that durable subscribers can resume consuming messages
// from where they left off after a reconnect.
func (broker *Broker) UpdateSubscription(name, dbName, channel string, lastID int64) {
	_, err := broker.database.Exec(`
		INSERT INTO subscriptions (name, db_name, channel, last_id, last_active)
		VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(name, db_name, channel) DO UPDATE SET
			last_id = excluded.last_id,
			last_active = CURRENT_TIMESTAMP
	`, name, dbName, channel, lastID)
	if err != nil {
		log.Printf("[Broker] Failed to update subscription: %v", err)
	}
}
