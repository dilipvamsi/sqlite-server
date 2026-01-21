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
run-load-test-setup: build-load-test-setup build ## Setup DBs and run server with loadtest config (NO AUTH)
	@echo "🚀 Starting server with LOADTEST config (AUTH DISABLED)..."
	SQLITE_SERVER_AUTH_ENABLED=false $(BINARY_OUT) $(LOADTEST_CONFIG)

.PHONY: run-load-test-setup-auth
run-load-test-setup-auth: build-load-test-setup build ## Setup DBs and run server WITH auth enabled
	@echo "🔐 Starting server with LOADTEST config (AUTH ENABLED)..."
	@echo "   Credentials: admin / admin"
	SQLITE_SERVER_ADMIN_PASSWORD=admin SQLITE_SERVER_AUTH_ENABLED=true $(BINARY_OUT) $(LOADTEST_CONFIG)

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
# Load Test: With API Key Authentication (Fast)
# ==============================================================================

LOAD_TEST_APIKEY_DIR := ./tests/load-with-api-key

$(BUILD_DIR)/tests-apikey/%$(EXT): $(LOAD_TEST_APIKEY_DIR)/%/main.go
	@mkdir -p $(BUILD_DIR)/tests-apikey
	@echo "🔨 Compiling API key tool: $*..."
	CGO_ENABLED=1 $(GOCMD) build -ldflags "$(LDFLAGS_COMMON)" -o $@ $<

APIKEY_BENCH_BINS := $(BUILD_DIR)/tests-apikey/read-db$(EXT) \
                     $(BUILD_DIR)/tests-apikey/read-stream-db$(EXT) \
                     $(BUILD_DIR)/tests-apikey/read-write-db$(EXT) \
                     $(BUILD_DIR)/tests-apikey/read-write-stream-db$(EXT)

.PHONY: setup-apikey
setup-apikey: $(BUILD_DIR)/tests-apikey/setup-apikey$(EXT) ## Generate API key for load tests
	@echo "🔑 Generating API key for load tests..."
	@$(BUILD_DIR)/tests-apikey/setup-apikey$(EXT)
	@echo "✅ API key saved to .loadtest-api-key"

.PHONY: build-load-test-apikey
build-load-test-apikey: $(APIKEY_BENCH_BINS) $(BUILD_DIR)/tests-apikey/setup-apikey$(EXT) ## Build API key benchmark clients
	@echo "✅ All API key load test binaries ready in $(BUILD_DIR)/tests-apikey/"

.PHONY: load-test-apikey
load-test-apikey: $(APIKEY_BENCH_BINS) ## Run API key benchmark clients (requires LOADTEST_API_KEY)
	@if [ -z "$$LOADTEST_API_KEY" ] && [ -f .loadtest-api-key ]; then \
		echo "🔑 Using API key from .loadtest-api-key"; \
		export LOADTEST_API_KEY=$$(cat .loadtest-api-key); \
		echo "🔐 Running API key benchmarks..."; \
		LOADTEST_API_KEY=$$LOADTEST_API_KEY $(BUILD_DIR)/tests-apikey/read-db$(EXT); \
		LOADTEST_API_KEY=$$LOADTEST_API_KEY $(BUILD_DIR)/tests-apikey/read-stream-db$(EXT); \
		LOADTEST_API_KEY=$$LOADTEST_API_KEY $(BUILD_DIR)/tests-apikey/read-write-db$(EXT); \
		LOADTEST_API_KEY=$$LOADTEST_API_KEY $(BUILD_DIR)/tests-apikey/read-write-stream-db$(EXT); \
	elif [ -n "$$LOADTEST_API_KEY" ]; then \
		echo "🔐 Running API key benchmarks..."; \
		$(BUILD_DIR)/tests-apikey/read-db$(EXT); \
		$(BUILD_DIR)/tests-apikey/read-stream-db$(EXT); \
		$(BUILD_DIR)/tests-apikey/read-write-db$(EXT); \
		$(BUILD_DIR)/tests-apikey/read-write-stream-db$(EXT); \
	else \
		echo "❌ LOADTEST_API_KEY not set. Run: make setup-apikey"; \
		exit 1; \
	fi
	@echo "🏁 API key benchmarks finished."

# ==============================================================================
# Load Test: With Basic Auth (Username/Password)
# ==============================================================================

LOAD_TEST_BASIC_DIR := ./tests/load-with-basic-auth

$(BUILD_DIR)/tests-basic/%$(EXT): $(LOAD_TEST_BASIC_DIR)/%/main.go
	@mkdir -p $(BUILD_DIR)/tests-basic
	@echo "🔨 Compiling Basic Auth tool: $*..."
	CGO_ENABLED=1 $(GOCMD) build -ldflags "$(LDFLAGS_COMMON)" -o $@ $<

BASIC_BENCH_BINS := $(BUILD_DIR)/tests-basic/read-db$(EXT) \
                    $(BUILD_DIR)/tests-basic/read-stream-db$(EXT) \
                    $(BUILD_DIR)/tests-basic/read-write-db$(EXT) \
                    $(BUILD_DIR)/tests-basic/read-write-stream-db$(EXT)

.PHONY: build-load-test-basic
build-load-test-basic: $(BASIC_BENCH_BINS) ## Build Basic Auth benchmark clients
	@echo "✅ All Basic Auth load test binaries ready in $(BUILD_DIR)/tests-basic/"

.PHONY: load-test-basic
load-test-basic: $(BASIC_BENCH_BINS) ## Run Basic Auth benchmark clients (uses admin/admin)
	@echo "🔐 Running Basic Auth benchmarks..."
	@LOADTEST_USERNAME=admin LOADTEST_PASSWORD=admin $(BUILD_DIR)/tests-basic/read-db$(EXT)
	@LOADTEST_USERNAME=admin LOADTEST_PASSWORD=admin $(BUILD_DIR)/tests-basic/read-stream-db$(EXT)
	@LOADTEST_USERNAME=admin LOADTEST_PASSWORD=admin $(BUILD_DIR)/tests-basic/read-write-db$(EXT)
	@LOADTEST_USERNAME=admin LOADTEST_PASSWORD=admin $(BUILD_DIR)/tests-basic/read-write-stream-db$(EXT)
	@echo "🏁 Basic Auth benchmarks finished."
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
	rm -rf _meta.db
	rm -f coverage.out coverage.raw.out coverage.html
	@echo "Cleanup complete."

.PHONY: help
help: ## Show this help screen
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-32s\033[0m %s\n", $$1, $$2}'
