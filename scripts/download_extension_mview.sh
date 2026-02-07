#!/bin/bash

# Script to download and organize the sqlite-mview extension.
# Usage: ./scripts/download_extension_mview.sh [version]
# Example: ./scripts/download_extension_mview.sh v2.0.0

set -e

ARG1=${1:-"v3.0.0"}
VERSION=$ARG1
if [[ "$ARG1" == *"@"* ]]; then
    VERSION=$(echo "$ARG1" | cut -d'@' -f2)
fi

EXTENSIONS_DIR="./extensions"
EXT_NAME="mview"
CLEAN_VERSION=$(echo "$VERSION" | sed 's/^v//')
TARGET_DIR="$EXTENSIONS_DIR/$EXT_NAME-$CLEAN_VERSION"

# Mapping of remote filenames to local structure
# remote_name | local_os | local_arch | ext
ASSETS=(
    "mview-linux-arm64.so|linux|arm64|so"
    "mview-linux-x64.so|linux|amd64|so"
    "mview-macos-universal.dylib|macos|universal|dylib"
    "mview-windows-arm64.dll|windows|arm64|dll"
    "mview-windows-x64.dll|windows|amd64|dll"
    "mview-windows-x86.dll|windows|i386|dll"
)

mkdir -p "$TARGET_DIR"

BASE_URL="https://github.com/dilipvamsi/sqlite-mview/releases/download/$VERSION"

echo "Downloading sqlite-mview $VERSION..."

for asset_info in "${ASSETS[@]}"; do
    IFS="|" read -r remote_name local_os local_arch ext <<< "$asset_info"

    URL="$BASE_URL/$remote_name"
    # Local filename: mview-v2.0.0-linux-amd64.so
    # We strip the 'v' from version if it exists for consistency with our discovery logic naming
    CLEAN_VERSION=$(echo "$VERSION" | sed 's/^v//')
    LOCAL_FILENAME="$EXT_NAME-$CLEAN_VERSION-$local_os-$local_arch.$ext"

    # Special case for universal
    if [ "$local_arch" == "universal" ]; then
        LOCAL_FILENAME="$EXT_NAME-$CLEAN_VERSION-$local_os-universal.$ext"
    fi

    echo "Downloading $URL -> $TARGET_DIR/$LOCAL_FILENAME"
    if curl -L -f -o "$TARGET_DIR/$LOCAL_FILENAME" "$URL"; then
        echo "Successfully downloaded $remote_name"
    else
        echo "Warning: Failed to download $remote_name (may not exist for this release)"
    fi
done

# Create info.json
echo "Creating info.json..."
cat <<EOF > "$TARGET_DIR/info.json"
{
  "description": "Materialized Views for SQLite",
  "documentation_url": "https://github.com/dilipvamsi/sqlite-mview"
}
EOF

echo "Done! sqlite-mview organized in $TARGET_DIR"
