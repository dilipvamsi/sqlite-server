# ==============================================================================
# OS Detection & Build Configuration
# ==============================================================================
ifeq ($(OS),Windows_NT)
    EXT := .exe
    # Windows static linking usually handled via -extldflags "-static"
    STATIC_LDFLAGS := -linkmode external -extldflags "-static"
else
    EXT := .bin
    # Linux: combine -static, -ldl (for sqlite extensions), and -lpthread
    # -Wl,-E exports symbols for plugin/extension support
    STATIC_LDFLAGS := -linkmode external -extldflags "-static -ldl -lpthread -Wl,-E"
endif

# ==============================================================================
# Variables
# ==============================================================================
BINARY_NAME    := sqlite-server
SERVER_DIR     := ./cmd/server
BUILD_DIR      := ./bin
TEST_DATA_DIR  := ./data-test
LOAD_TEST_DIR  := ./tests/load

BINARY_OUT        := $(BUILD_DIR)/$(BINARY_NAME)$(EXT)
BINARY_STATIC_OUT := $(BUILD_DIR)/$(BINARY_NAME)-static$(EXT)

# Config Paths
DEFAULT_CONFIG         := config.json
LOADTEST_CONFIG        := ./tests/load/loadtest.config.json
LOADTEST_CIPHER_CONFIG := ./tests/load/loadtest-cipher.config.json

# Tooling
GOCMD          := go
LDFLAGS_COMMON := -s -w
STATIC_TAGS    := osusergo,netgo

# Common build command for dynamic binaries
# CGO_ENABLED=1 is strictly required for mattn/go-sqlite3
GOBUILD_DYNAMIC := CGO_ENABLED=1 $(GOCMD) build -ldflags "$(LDFLAGS_COMMON)"

# ==============================================================================
# Main Targets
# ==============================================================================

.PHONY: all
all: proto build ## Generate Protobuf code and build the dynamic binary

.PHONY: build
build: build-dynamic ## Default build (alias for build-dynamic)

.PHONY: build-dynamic
build-dynamic: ## Build a dynamically linked binary
	@echo "Building dynamic binary: $(BINARY_OUT)"
	@mkdir -p $(BUILD_DIR)
	$(GOBUILD_DYNAMIC) -o $(BINARY_OUT) $(SERVER_DIR)/main.go

.PHONY: build-static
build-static: ## Build a mostly-static binary (with extension support)
	@echo "Building static-portable binary: $(BINARY_STATIC_OUT)"
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=1 $(GOCMD) build \
		-tags "$(STATIC_TAGS)" \
		-ldflags '$(LDFLAGS_COMMON) $(STATIC_LDFLAGS)' \
		-o $(BINARY_STATIC_OUT) $(SERVER_DIR)/main.go

.PHONY: run
run: build ## Build and run the server with default config
	@echo "Running $(BINARY_OUT)..."
	$(BINARY_OUT) $(DEFAULT_CONFIG)

.PHONY: run-dev
run-dev: ## Run directly using 'go run' (fast development)
	@echo "Starting server in dev mode..."
	CGO_ENABLED=1 $(GOCMD) run $(SERVER_DIR)/main.go $(DEFAULT_CONFIG)

# ==============================================================================
# Protocol Buffers
# ==============================================================================

.PHONY: gen-proto
gen-proto: ## Generate Go code from .proto files using buf
	@echo "Generating Protobuf code..."
	buf generate

.PHONY: proto-lint
proto-lint: ## Run linting on .proto files
	buf lint

# ==============================================================================
# Testing & Coverage
# ==============================================================================

.PHONY: test
test: ## Run standard unit tests (no coverage report)
	@echo "🧪 Running unit tests..."
	CGO_ENABLED=1 $(GOCMD) test -v ./...

.PHONY: test-coverage
test-coverage: ## Run tests and generate coverage report (excluding protos and load tests)
	@echo "🧪 Running tests with coverage..."
	# 1. Run tests forcing CGO, output raw profile
	CGO_ENABLED=1 $(GOCMD) test -v -coverprofile=coverage.raw.out ./...

	# 2. Filter out generated proto files AND load tests using grep -E (extended regex)
	@echo "🧹 Filtering generated code and load tests..."
	@grep -vE "internal/protos|tests/load|cmd/server" coverage.raw.out > coverage.out

	# 3. Display function-level coverage summary in terminal
	@echo "📊 Coverage Summary:"
	@$(GOCMD) tool cover -func=coverage.out

	# 4. Generate HTML report for visualization
	@$(GOCMD) tool cover -html=coverage.out -o coverage.html
	@echo "✅ HTML report generated: coverage.html"

	# 5. Cleanup raw intermediate file
	@rm coverage.raw.out

# ==============================================================================
# Load Test: Data Initialization
# ==============================================================================

# Pattern rule: Builds any tool in tests/load/[name]/main.go to bin/tests/[name].bin
$(BUILD_DIR)/tests/%$(EXT): $(LOAD_TEST_DIR)/%/main.go
	@mkdir -p $(BUILD_DIR)/tests
	@echo "🔨 Compiling tool: $*..."
	CGO_ENABLED=1 $(GOCMD) build -ldflags "$(LDFLAGS_COMMON)" -o $@ $<

$(TEST_DATA_DIR):
	@mkdir -p $(TEST_DATA_DIR)

.PHONY: build-load-test-setup
build-load-test-setup: $(TEST_DATA_DIR) $(BUILD_DIR)/tests/setup-read-db$(EXT) $(BUILD_DIR)/tests/setup-mixed-db$(EXT) ## Build and run setup tools to create test DBs
	@echo "📦 Initializing test databases..."
	@$(BUILD_DIR)/tests/setup-read-db$(EXT)
	@$(BUILD_DIR)/tests/setup-mixed-db$(EXT)
	@echo "✅ Setup complete. Local .db files created in $(TEST_DATA_DIR)"

.PHONY: build-load-test-setup-cipher
build-load-test-setup-cipher: $(TEST_DATA_DIR) $(BUILD_DIR)/tests/setup-read-db$(EXT) $(BUILD_DIR)/tests/setup-mixed-db$(EXT) ## Setup encrypted test databases
	@echo "🔐 Initializing encrypted databases..."
	@$(BUILD_DIR)/tests/setup-read-db$(EXT) --cipher
	@$(BUILD_DIR)/tests/setup-mixed-db$(EXT) --cipher
	@echo "✅ Encrypted setup complete."

# ==============================================================================
# Load Test: Server & Client Execution
# ==============================================================================

.PHONY: run-load-test-setup
run-load-test-setup: build-load-test-setup build ## Setup DBs and run server with loadtest config
	@echo "🚀 Starting server with LOADTEST config..."
	$(BINARY_OUT) $(LOADTEST_CONFIG)

.PHONY: run-load-test-setup-cipher
run-load-test-setup-cipher: build-load-test-setup-cipher build ## Setup encrypted DBs and run server with cipher config
	@echo "🚀 Starting server with LOADTEST CIPHER config..."
	$(BINARY_OUT) $(LOADTEST_CIPHER_CONFIG)

BENCH_BINS := $(BUILD_DIR)/tests/read-db$(EXT) \
              $(BUILD_DIR)/tests/read-stream-db$(EXT) \
              $(BUILD_DIR)/tests/read-write-db$(EXT) \
              $(BUILD_DIR)/tests/read-write-stream-db$(EXT)

.PHONY: build-load-test
build-load-test: $(BENCH_BINS) ## Build all benchmark clients
	@echo "✅ All load test binaries are ready in $(BUILD_DIR)/tests/"

.PHONY: load-test
load-test: $(BENCH_BINS) ## Run benchmark clients (Server must be running)
	@echo "🏃 Running benchmarks..."
	@$(BUILD_DIR)/tests/read-db$(EXT)
	@$(BUILD_DIR)/tests/read-stream-db$(EXT)
	@$(BUILD_DIR)/tests/read-write-db$(EXT)
	@$(BUILD_DIR)/tests/read-write-stream-db$(EXT)
	@echo "🏁 Benchmarks finished."

# ==============================================================================
# Helpers
# ==============================================================================

.PHONY: tidy
tidy: ## Clean up and sync go.mod and go.sum
	$(GOCMD) mod tidy

.PHONY: clean
clean: ## Remove binaries, database files, and coverage reports
	rm -rf $(BUILD_DIR)
	rm -rf $(TEST_DATA_DIR)
	rm -f coverage.out coverage.raw.out coverage.html
	@echo "Cleanup complete."

.PHONY: help
help: ## Show this help screen
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-32s\033[0m %s\n", $$1, $$2}'
