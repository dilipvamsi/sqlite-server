# ==============================================================================
# OS Detection & Extension Handling
# ==============================================================================
ifeq ($(OS),Windows_NT)
    EXT := .exe
    STATIC_EXTLDFLAGS := -static
else
    EXT := .bin
    # Linux/Unix: "Mostly static" - links everything statically EXCEPT the dynamic loader
    # to allow loading external .so extensions via dlopen.
    STATIC_EXTLDFLAGS := -static-libgcc -extldflags "-static -ldl -lpthread -Wl,-E"
endif

# ==============================================================================
# Variables
# ==============================================================================
BINARY_NAME=sqlite-server
SERVER_DIR=./cmd/sever
BUILD_DIR=./bin
CONFIG_FILE=config.json

BINARY_OUT=$(BUILD_DIR)/$(BINARY_NAME)$(EXT)
BINARY_STATIC_OUT=$(BUILD_DIR)/$(BINARY_NAME)-static$(EXT)

LOAD_TEST_DIR=./tests/load
LOAD_TEST_BINS=setup-read-db read-db read-stream-db setup-mixed-db read-write-db read-write-stream-db

GO=go
GOCMD=$(GO)
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOMOD=$(GOCMD) mod

# Build Flags
LDFLAGS_COMMON=-s -w
STATIC_TAGS=osusergo,netgo

# ==============================================================================
# Build & Development
# ==============================================================================

.PHONY: all
all: proto build ## Generate Protobuf code and build the dynamic binary

.PHONY: build
build: build-dynamic ## Default build (alias for build-dynamic)

.PHONY: build-dynamic
build-dynamic: ## Build a dynamically linked binary (.bin or .exe)
	@echo "Building dynamic binary: $(BINARY_OUT)"
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=1 $(GOBUILD) -ldflags "$(LDFLAGS_COMMON)" -o $(BINARY_OUT) $(SERVER_DIR)/main.go

.PHONY: build-static
build-static: ## Build a mostly-static binary that supports external .so/.dll extensions
	@echo "Building static-portable binary: $(BINARY_STATIC_OUT)"
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=1 $(GOBUILD) \
		-tags $(STATIC_TAGS) \
		-ldflags '$(LDFLAGS_COMMON) -linkmode external $(STATIC_EXTLDFLAGS)' \
		-o $(BINARY_STATIC_OUT) $(SERVER_DIR)/main.go

.PHONY: run
run: build ## Build and run the server with default config
	@echo "Running $(BINARY_OUT)..."
	$(BINARY_OUT) $(CONFIG_FILE)

.PHONY: run-dev
run-dev: ## Run the server directly using 'go run' (fast development)
	@echo "Starting server in dev mode..."
	$(GOCMD) run $(SERVER_DIR)/main.go $(CONFIG_FILE)

.PHONY: tidy
tidy: ## Clean up and sync go.mod and go.sum
	$(GOMOD) tidy

# ==============================================================================
# Protocol Buffers
# ==============================================================================

.PHONY: proto
proto: ## Generate Go code from .proto files using buf
	@echo "Generating Protobuf code..."
	buf generate

.PHONY: proto-lint
proto-lint: ## Run linting on .proto files
	buf lint

# ==============================================================================
# Testing & Load Tests
# ==============================================================================

.PHONY: test
test: ## Run standard unit tests for internal packages
	$(GOTEST) -v ./internal/...

.PHONY: build-load-tests
build-load-tests: ## Build all load test binaries into bin/tests/
	@echo "Building load tests..."
	@mkdir -p $(BUILD_DIR)/tests
	@$(foreach test,$(LOAD_TEST_BINS), \
		echo "Building $(test)$(EXT)..."; \
		$(GOBUILD) -o $(BUILD_DIR)/tests/$(test)$(EXT) $(LOAD_TEST_DIR)/$(test)/main.go; \
	)

.PHONY: run-load-tests
run-load-tests: build-load-tests ## Build and execute the full sequence of load tests
	@echo "🚀 Starting Load Test Suite..."
	@echo "1/3: Setting up databases..."
	$(BUILD_DIR)/tests/setup-read-db$(EXT)
	$(BUILD_DIR)/tests/setup-mixed-db$(EXT)
	@echo "2/3: Running Read tests..."
	$(BUILD_DIR)/tests/read-db$(EXT)
	$(BUILD_DIR)/tests/read-stream-db$(EXT)
	@echo "3/3: Running Write/Stream tests..."
	$(BUILD_DIR)/tests/read-write-db$(EXT)
	$(BUILD_DIR)/tests/read-write-stream-db$(EXT)
	@echo "✅ Load tests completed."

# ==============================================================================
# Utilities
# ==============================================================================

.PHONY: clean
clean: ## Remove the bin directory and clean go build cache
	@echo "Cleaning up..."
	rm -rf $(BUILD_DIR)
	$(GOCLEAN)

.PHONY: help
help: ## Display this help screen containing all commands
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
