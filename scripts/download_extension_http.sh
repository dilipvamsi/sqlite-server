#!/bin/bash

# Script to download and organize the sqlite-http extension.
# Usage: ./scripts/download_extension_http.sh [version]
# Example: ./scripts/download_extension_http.sh v0.1.1

set -e

VERSION=${1:-"v0.1.1"}
CLEAN_VERSION=$(echo "$VERSION" | sed 's/^v//')
EXTENSIONS_DIR="./extensions"
EXT_NAME="http"
TARGET_DIR="$EXTENSIONS_DIR/$EXT_NAME-$CLEAN_VERSION"
TMP_DIR="./tmp_http"

# Mapping of remote filenames to local structure
# remote_suffix | local_os | local_arch | archive_type
ASSETS=(
    "linux-x86_64|linux|amd64|tar.gz"
    "macos-aarch64|macos|arm64|tar.gz"
    "macos-x86_64|macos|amd64|tar.gz"
    "windows-x86_64|windows|amd64|zip"
)

mkdir -p "$TARGET_DIR"
mkdir -p "$TMP_DIR"

BASE_URL="https://github.com/asg017/sqlite-http/releases/download/$VERSION"

echo "Downloading sqlite-http $VERSION..."

for asset_info in "${ASSETS[@]}"; do
    IFS="|" read -r remote_suffix local_os local_arch archive_type <<< "$asset_info"

    FILE_NAME="sqlite-http-$VERSION-loadable-$remote_suffix.$archive_type"
    URL="$BASE_URL/$FILE_NAME"

    # Determine extension
    EXT="so"
    if [ "$local_os" == "windows" ]; then EXT="dll"; fi
    if [ "$local_os" == "macos" ]; then EXT="dylib"; fi

    LOCAL_FILENAME="$EXT_NAME-$CLEAN_VERSION-$local_os-$local_arch.$EXT"

    if [ -f "$TARGET_DIR/$LOCAL_FILENAME" ]; then
        echo "Skipping $LOCAL_FILENAME (already exists)"
        continue
    fi

    echo "Downloading $URL..."
    if curl -L -f -o "$TMP_DIR/$FILE_NAME" "$URL"; then
        echo "Extracting $FILE_NAME..."
        if [ "$archive_type" == "tar.gz" ]; then
            tar -xzf "$TMP_DIR/$FILE_NAME" -C "$TMP_DIR"
        else
            unzip -o "$TMP_DIR/$FILE_NAME" -d "$TMP_DIR"
        fi

        # Find the actual library file. It should be http0.$EXT
        SEARCH_NAME="http0.$EXT"

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

        # Cleanup temp extracted files except the archive
        find "$TMP_DIR" -maxdepth 1 -not -name "*.$archive_type" -type f -delete 2>/dev/null || true
    else
        echo "Warning: Failed to download $FILE_NAME"
    fi
done

# Create info.json
echo "Creating info.json..."
cat <<EOF > "$TARGET_DIR/info.json"
{
  "description": "HTTP request support for SQLite",
  "documentation_url": "https://github.com/asg017/sqlite-http"
}
EOF

# Cleanup
rm -rf "$TMP_DIR"

echo "Done! sqlite-http organized in $TARGET_DIR"
