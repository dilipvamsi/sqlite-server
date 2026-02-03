#!/bin/bash

# Script to download and organize the sqlite-vec extension.
# Usage: ./scripts/download_extension_vec.sh [version]
# Example: ./scripts/download_extension_vec.sh v0.1.6

set -e

VERSION=${1:-"v0.1.6"}
CLEAN_VERSION=$(echo "$VERSION" | sed 's/^v//')
EXTENSIONS_DIR="./extensions"
EXT_NAME="vec"
TARGET_DIR="$EXTENSIONS_DIR/$EXT_NAME-$CLEAN_VERSION"
TMP_DIR="./tmp_vec"

# Mapping of remote filenames to local structure
# remote_suffix | local_os | local_arch
ASSETS=(
    "linux-aarch64|linux|arm64"
    "linux-x86_64|linux|amd64"
    "macos-aarch64|macos|arm64"
    "macos-x86_64|macos|amd64"
    "windows-x86_64|windows|amd64"
)

mkdir -p "$TARGET_DIR"
mkdir -p "$TMP_DIR"

BASE_URL="https://github.com/asg017/sqlite-vec/releases/download/$VERSION"

echo "Downloading sqlite-vec $VERSION..."

for asset_info in "${ASSETS[@]}"; do
    IFS="|" read -r remote_suffix local_os local_arch <<< "$asset_info"
    
    TAR_NAME="sqlite-vec-$CLEAN_VERSION-loadable-$remote_suffix.tar.gz"
    URL="$BASE_URL/$TAR_NAME"
    
    # Determine extension
    EXT="so"
    if [ "$local_os" == "windows" ]; then EXT="dll"; fi
    if [ "$local_os" == "macos" ]; then EXT="dylib"; fi

    LOCAL_FILENAME="$EXT_NAME-$CLEAN_VERSION-$local_os-$local_arch.$EXT"

    # Skip if already exists
    if [ -f "$TARGET_DIR/$LOCAL_FILENAME" ]; then
        echo "Skipping $LOCAL_FILENAME (already exists)"
        continue
    fi

    echo "Downloading $URL..."
    if curl -L -f -o "$TMP_DIR/$TAR_NAME" "$URL"; then
        echo "Extracting $TAR_NAME..."
        tar -xzf "$TMP_DIR/$TAR_NAME" -C "$TMP_DIR"

        # Find the actual library file.
        SEARCH_NAME="vec0.$EXT"

        if [ -f "$TMP_DIR/$SEARCH_NAME" ]; then
            mv "$TMP_DIR/$SEARCH_NAME" "$TARGET_DIR/$LOCAL_FILENAME"
            echo "Successfully organized $LOCAL_FILENAME"
        else
            # Fallback
            FOUND_FILE=$(find "$TMP_DIR" -maxdepth 1 -name "*.$EXT" | head -n 1)
            if [ -n "$FOUND_FILE" ]; then
                mv "$FOUND_FILE" "$TARGET_DIR/$LOCAL_FILENAME"
                echo "Successfully organized $LOCAL_FILENAME (found fallback: $(basename "$FOUND_FILE"))"
            fi
        fi

        # Cleanup
        rm -f "$TMP_DIR"/*."$EXT" 2>/dev/null || true
        rm -f "$TMP_DIR"/*.txt 2>/dev/null || true
    else
        echo "Warning: Failed to download $TAR_NAME"
    fi
done

# Create info.json
echo "Creating info.json..."
cat <<EOF > "$TARGET_DIR/info.json"
{
  "description": "A vector search extension for SQLite",
  "documentation_url": "https://github.com/asg017/sqlite-vec"
}
EOF

# Cleanup
rm -rf "$TMP_DIR"

echo "Done! sqlite-vec organized in $TARGET_DIR"
