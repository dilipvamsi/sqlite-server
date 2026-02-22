#!/bin/bash
set -e

# Configuration
VERSION="7.1.0"
INSTALL_DIR="./bin"
CACHE_DIR="./thirdparty"

# Create directories if they don't exist
mkdir -p "$INSTALL_DIR"
mkdir -p "$CACHE_DIR"

# Detect OS and Architecture
OS_RAW=$(uname -s)
ARCH_RAW=$(uname -m)
EXE=""

case "$OS_RAW" in
    Linux)
        PLATFORM="unknown-linux-gnu"
        EXT="tar.gz"
        ;;
    Darwin)
        PLATFORM="apple-darwin"
        EXT="tar.gz"
        ;;
    MINGW*|MSYS*|CYGWIN*|Windows_NT)
        PLATFORM="pc-windows-msvc"
        EXT="zip"
        EXE=".exe"
        ;;
    *)
        echo "Unsupported OS: $OS_RAW"
        exit 1
        ;;
esac

case "$ARCH_RAW" in
    x86_64|amd64)
        ARCH="x86_64"
        ;;
    arm64|aarch64)
        ARCH="aarch64"
        ;;
    *)
        echo "Unsupported architecture: $ARCH_RAW"
        exit 1
        ;;
esac

if [ -f "$INSTALL_DIR/hurl$EXE" ]; then
    echo "Hurl is already present in $INSTALL_DIR"
    exit 0
fi

ASSET_NAME="hurl-$VERSION-$ARCH-$PLATFORM"
FILE_NAME="$ASSET_NAME.$EXT"
CACHE_PATH="$CACHE_DIR/$FILE_NAME"
URL="https://github.com/Orange-OpenSource/hurl/releases/download/$VERSION/$FILE_NAME"

if [ -f "$CACHE_PATH" ]; then
    echo "Using cached Hurl archive: $CACHE_PATH"
else
    echo "Downloading Hurl v$VERSION for $ARCH-$OS_RAW..."
    curl -L "$URL" -o "$CACHE_PATH"
fi

# Extract binary based on extension
if [ "$EXT" = "tar.gz" ]; then
    tar -xzf "$CACHE_PATH"
    mv "$ASSET_NAME/bin/hurl" "$INSTALL_DIR/"
else
    # Check for unzip command
    if ! command -v unzip &> /dev/null; then
        echo "Error: 'unzip' is required to extract the Hurl binary on Windows."
        echo "Please install it or extract $FILE_NAME manually."
        exit 1
    fi
    unzip -q "$CACHE_PATH"
    mv "$ASSET_NAME/bin/hurl.exe" "$INSTALL_DIR/"
fi

# Cleanup (only extracted directory, keep the archive in cache)
rm -rf "$ASSET_NAME"

echo "✅ Hurl installed successfully to $INSTALL_DIR/hurl$EXE"
echo "You can now run Hurl tests using: make test-hurl"
