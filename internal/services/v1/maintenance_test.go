package servicesv1

import (
	"context"
	"path/filepath"
	"testing"

	sqlrpcv1 "sqlite-server/internal/protos/sqlrpc/v1"
	"sqlite-server/internal/sqldrivers"

	"connectrpc.com/connect"
)

func TestMaintenanceRPCs(t *testing.T) {
	// Setup: Create a temporary DB
	tmpDir := t.TempDir()
	dbName := "maintenance_test"
	dbPath := filepath.Join(tmpDir, "maintenance.db")

	config := &sqlrpcv1.DatabaseConfig{
		Name:   dbName,
		DbPath: dbPath,
	}

	// Initialize Server
	server := NewDbServer([]*sqlrpcv1.DatabaseConfig{config}, nil)
	defer server.Stop()

	// Pre-populate DB
	db, err := server.dbManager.GetConnection(context.Background(), dbName, ModeRW)
	if err != nil {
		t.Fatalf("Failed to get connection: %v", err)
	}
	if _, err := db.Exec("CREATE TABLE test (id INTEGER PRIMARY KEY, val TEXT)"); err != nil {
		t.Fatalf("Failed to create table: %v", err)
	}
	if _, err := db.Exec("INSERT INTO test (val) VALUES ('A'), ('B'), ('C')"); err != nil {
		t.Fatalf("Failed to insert data: %v", err)
	}

	ctx := context.Background()

	t.Run("Vacuum", func(t *testing.T) {
		req := connect.NewRequest(&sqlrpcv1.VacuumRequest{
			Database: dbName,
		})
		res, err := server.Vacuum(ctx, req)
		if err != nil {
			t.Fatalf("Vacuum failed: %v", err)
		}
		if !res.Msg.Success {
			t.Errorf("Expected success=true, got false")
		}
	})

	t.Run("Vacuum Into", func(t *testing.T) {
		backupFile := filepath.Join(tmpDir, "backup.db")
		req := connect.NewRequest(&sqlrpcv1.VacuumRequest{
			Database: dbName,
			IntoFile: &backupFile,
		})
		res, err := server.Vacuum(ctx, req)
		if err != nil {
			t.Fatalf("Vacuum Into failed: %v", err)
		}
		if !res.Msg.Success {
			t.Errorf("Expected success=true, got false")
		}

		// Verify backup exists and is valid
		backupDB, err := sqldrivers.NewSqliteDb(&sqlrpcv1.DatabaseConfig{Name: "backup", DbPath: backupFile}, false)
		if err != nil {
			t.Fatalf("Failed to open backup DB: %v", err)
		}
		defer backupDB.Close()

		var count int
		if err := backupDB.QueryRow("SELECT COUNT(*) FROM test").Scan(&count); err != nil {
			t.Fatalf("Failed to query backup DB: %v", err)
		}
		if count != 3 {
			t.Errorf("Expected 3 rows in backup, got %d", count)
		}
	})

	t.Run("Checkpoint", func(t *testing.T) {
		modes := []sqlrpcv1.CheckpointMode{
			sqlrpcv1.CheckpointMode_CHECKPOINT_MODE_PASSIVE,
			sqlrpcv1.CheckpointMode_CHECKPOINT_MODE_FULL,
			sqlrpcv1.CheckpointMode_CHECKPOINT_MODE_RESTART,
			sqlrpcv1.CheckpointMode_CHECKPOINT_MODE_TRUNCATE,
		}

		for _, mode := range modes {
			req := connect.NewRequest(&sqlrpcv1.CheckpointRequest{
				Database: dbName,
				Mode:     mode,
			})
			res, err := server.Checkpoint(ctx, req)
			if err != nil {
				t.Fatalf("Checkpoint %v failed: %v", mode, err)
			}
			if !res.Msg.Success {
				t.Errorf("Expected success=true for mode %v", mode)
			}
			// We can't strictly assert log/busy counts without complex WAL simulation,
			// but we check the RPC returns without error.
		}
	})

	t.Run("IntegrityCheck", func(t *testing.T) {
		req := connect.NewRequest(&sqlrpcv1.IntegrityCheckRequest{
			Database: dbName,
		})
		res, err := server.IntegrityCheck(ctx, req)
		if err != nil {
			t.Fatalf("IntegrityCheck failed: %v", err)
		}
		if !res.Msg.Success {
			t.Errorf("Expected success=true, got false")
		}
		if len(res.Msg.Errors) > 0 {
			t.Errorf("Expected 0 errors, got %v", res.Msg.Errors)
		}
	})

	t.Run("NotFound", func(t *testing.T) {
		req := connect.NewRequest(&sqlrpcv1.VacuumRequest{
			Database: "nonexistent",
		})
		_, err := server.Vacuum(ctx, req)
		if err == nil {
			t.Fatal("Expected error for nonexistent database, got nil")
		}
		if connect.CodeOf(err) != connect.CodeNotFound {
			t.Errorf("Expected CodeNotFound, got %v", connect.CodeOf(err))
		}
	})
}

func TestIntegrityCheck_QueryError(t *testing.T) {
	_, dbServer := setupTestServer(t)
	ctx := context.Background()

	// 1. Mount DB
	if err := dbServer.MountDatabase(&sqlrpcv1.DatabaseConfig{Name: "integrity_fail", DbPath: ":memory:"}); err != nil {
		t.Fatalf("MountDatabase failed: %v", err)
	}

	if _, err := dbServer.dbManager.GetConnection(ctx, "integrity_fail", ModeRW); err != nil {
		t.Fatalf("GetConnection failed: %v", err)
	}

	// 2. Cancel context to force error
	ctx, cancel := context.WithCancel(ctx)
	cancel()

	// 3. Run Integrity Check
	checkReq := connect.NewRequest(&sqlrpcv1.IntegrityCheckRequest{
		Database: "integrity_fail",
	})
	_, err := dbServer.IntegrityCheck(ctx, checkReq)
	if err == nil {
		t.Fatal("Expected error due to context cancellation, got nil")
	}
}
