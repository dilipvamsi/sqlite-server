package servicesv1

import (
	"context"
	"fmt"
	"log"
	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/pubsub"

	"connectrpc.com/connect"
)

// Publish implements DatabaseService.Publish.
// It allows external gRPC/Connect clients to publish a single message to a specified
// channel within a database. It enforces write authorization before processing.
func (server *DbServer) Publish(ctx context.Context, request *connect.Request[sqlrpcv1.PublishRequest]) (*connect.Response[sqlrpcv1.PublishResponse], error) {
	if err := AuthorizeWrite(ctx); err != nil {
		return nil, err
	}

	if !server.dbManager.HasDatabase(request.Msg.Database) {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database not found: %s", request.Msg.Database))
	}

	payload := pubsub.MsgPayload{
		Channel: request.Msg.Channel,
		Payload: request.Msg.Payload,
		DbName:  request.Msg.Database,
	}

	publishedIDs := server.broker.Publish(request.Msg.Database, []pubsub.MsgPayload{payload})
	if len(publishedIDs) == 0 {
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to publish message"))
	}

	return connect.NewResponse(&sqlrpcv1.PublishResponse{
		MessageId: publishedIDs[0],
	}), nil
}

// PublishBatch implements DatabaseService.PublishBatch.
// It allows external gRPC/Connect clients to publish multiple messages
// in a single request, improving performance by utilizing the broker's batching.
func (server *DbServer) PublishBatch(ctx context.Context, request *connect.Request[sqlrpcv1.PublishBatchRequest]) (*connect.Response[sqlrpcv1.PublishBatchResponse], error) {
	if err := AuthorizeWrite(ctx); err != nil {
		return nil, err
	}

	if !server.dbManager.HasDatabase(request.Msg.Database) {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("database not found: %s", request.Msg.Database))
	}

	items := make([]pubsub.MsgPayload, len(request.Msg.Items))
	for i, item := range request.Msg.Items {
		items[i] = pubsub.MsgPayload{
			Channel: item.Channel,
			Payload: item.Payload,
			DbName:  request.Msg.Database,
		}
	}

	publishedIDs := server.broker.Publish(request.Msg.Database, items)
	return connect.NewResponse(&sqlrpcv1.PublishBatchResponse{
		MessageIds: publishedIDs,
	}), nil
}

// Subscribe implements DatabaseService.Subscribe.
// It establishes a long-lived streaming connection for clients to receive messages.
// It ensures durable delivery by first catching up on any missed messages
// based on the provided subscriptionName, and then switching to the live Signal Hub.
func (server *DbServer) Subscribe(ctx context.Context, request *connect.Request[sqlrpcv1.SubscribeRequest], stream *connect.ServerStream[sqlrpcv1.SubscribeResponse]) error {
	log.Printf("[DEBUG] Subscribe called for %s on %s", request.Msg.Database, request.Msg.Channel)
	// Subscribing is allowed for READ_ONLY users
	if err := AuthorizeRead(ctx); err != nil {
		log.Printf("[DEBUG] Subscribe authorization failed: %v", err)
		return err
	}

	if !server.dbManager.HasDatabase(request.Msg.Database) {
		return connect.NewError(connect.CodeNotFound, fmt.Errorf("database not found: %s", request.Msg.Database))
	}

	log.Printf("[DEBUG] Subscribe authorized")

	databaseName := request.Msg.Database
	channelName := request.Msg.Channel
	subscriptionName := request.Msg.SubscriptionName

	// 1. Listen for live signals FIRST to avoid missing messages
	// published between catchUp and signal subscription.
	signalChan, cleanup := server.broker.SubscribeSignal(databaseName, channelName)
	defer cleanup()

	// 2. Catch up on missed messages from DB
	log.Printf("[DEBUG] Subscribe: Starting catchUp")
	lastSeenID, err := server.catchUp(ctx, databaseName, channelName, subscriptionName, stream)
	if err != nil {
		log.Printf("[DEBUG] Subscribe: catchUp failed: %v", err)
		return err
	}
	log.Printf("[DEBUG] Subscribe: catchUp finished")

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case signalMsg := <-signalChan:
			// Deduplicate: If the signal message ID is <= lastSeenID, it means
			// we already sent this message during the catchUp phase.
			if signalMsg.ID <= lastSeenID {
				log.Printf("[DEBUG] Subscribe skipped duplicate signal: ID %d (<= %d)", signalMsg.ID, lastSeenID)
				continue
			}

			err := stream.Send(&sqlrpcv1.SubscribeResponse{
				Database:  signalMsg.DbName,
				Channel:   signalMsg.Channel,
				Payload:   signalMsg.Payload,
				MessageId: signalMsg.ID,
			})
			if err != nil {
				return err
			}

			lastSeenID = signalMsg.ID

			// Update persistent offset
			if subscriptionName != "" {
				server.broker.UpdateSubscription(subscriptionName, databaseName, channelName, signalMsg.ID)
			}
		}
	}
}

// catchUp retrieves any historically missed messages for a subscription
// directly from the broker's persistent database and streams them to the client.
// It returns the highest message ID successfully sent to the client (or the starting offset if none).
func (server *DbServer) catchUp(ctx context.Context, databaseName, channelName, subscriptionName string, stream *connect.ServerStream[sqlrpcv1.SubscribeResponse]) (int64, error) {
	// Find last offset for this sub
	var lastID int64
	log.Printf("[DEBUG] catchUp: queryRow executing for sub %s", subscriptionName)
	err := server.broker.GetDB().QueryRow("SELECT last_id FROM subscriptions WHERE name = ? AND db_name = ? AND channel = ?", subscriptionName, databaseName, channelName).Scan(&lastID)
	if err != nil {
		log.Printf("[DEBUG] catchUp: queryRow failed (likely not found): %v", err)
		// Not found, start from 0 or latest? Let's start from 0 to ensure durability
		lastID = 0
	}
	log.Printf("[DEBUG] catchUp: queryRow finished, lastID: %d", lastID)

	log.Printf("[DEBUG] catchUp: queryContext executing")
	rows, err := server.broker.GetDB().QueryContext(ctx, "SELECT id, channel, payload FROM messages WHERE db_source = ? AND channel = ? AND id > ? ORDER BY id ASC", databaseName, channelName, lastID)
	if err != nil {
		log.Printf("[DEBUG] catchUp: queryContext failed: %v", err)
		return lastID, err
	}
	log.Printf("[DEBUG] catchUp: queryContext executed")
	defer rows.Close()

	for rows.Next() {
		var signalMsg sqlrpcv1.SubscribeResponse
		signalMsg.Database = databaseName
		err := rows.Scan(&signalMsg.MessageId, &signalMsg.Channel, &signalMsg.Payload)
		if err != nil {
			return lastID, err
		}
		if err := stream.Send(&signalMsg); err != nil {
			return lastID, err
		}
		lastID = signalMsg.MessageId
	}

	rows.Close() // Explicitly close to release connection before UpdateSubscription

	if lastID > 0 && subscriptionName != "" {
		server.broker.UpdateSubscription(subscriptionName, databaseName, channelName, lastID)
	}
	return lastID, rows.Err()
}
