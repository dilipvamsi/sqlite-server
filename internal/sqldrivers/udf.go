package sqldrivers

import (
	"sqlite-server/internal/pubsub"
)

// BatchAggregator implements the aggregate publish_batch() function.
// BatchAggregator implements a custom SQLite aggregate function ('publish_batch').
// It groups multiple published messages during an INSERT ... SELECT operation
// and flushes them to the Broker in chunks to optimize performance.
type BatchAggregator struct {
	broker          *pubsub.Broker
	dbName          string
	pendingMessages []pubsub.MsgPayload
}

// Step is called by SQLite for each row processed by the aggregate function.
// It buffers incoming messages and publishes them to the Broker when the batch size is reached.
func (aggregator *BatchAggregator) Step(channel, payload string) {
	aggregator.pendingMessages = append(aggregator.pendingMessages, pubsub.MsgPayload{Channel: channel, Payload: payload})
	// Sync limit (1000 rows) to keep memory usage bounded during massive bulk publishes
	if len(aggregator.pendingMessages) >= 1000 {
		aggregator.broker.Publish(aggregator.dbName, aggregator.pendingMessages)
		aggregator.pendingMessages = aggregator.pendingMessages[:0]
	}
}

// Done is called by SQLite after all rows have been processed.
// It flushes any remaining buffered messages to the Broker.
func (aggregator *BatchAggregator) Done() string {
	if len(aggregator.pendingMessages) > 0 {
		aggregator.broker.Publish(aggregator.dbName, aggregator.pendingMessages)
	}
	return "OK"
}
