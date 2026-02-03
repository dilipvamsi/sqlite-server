#!/bin/bash

# Script to download and organize SQLite extensions from sqlean project.
# Usage: ./scripts/download_extensions.sh [version]
# Example: ./scripts/download_extensions.sh 0.28.0

set -e

VERSION=${1:-"0.28.0"}
EXTENSIONS_DIR="./extensions"
TMP_DIR="./tmp_extensions"

# OS/Arch pairs for sqlean
# Format: <remote_suffix>|<local_os>|<local_arch>|<file_ext>
PLATFORMS=(
    "linux-arm64|linux|arm64|so"
    "linux-x64|linux|amd64|so"
    "macos-arm64|macos|arm64|dylib"
    "macos-x64|macos|amd64|dylib"
    "win-x64|windows|amd64|dll"
)

mkdir -p "$EXTENSIONS_DIR"
mkdir -p "$TMP_DIR"

for platform_info in "${PLATFORMS[@]}"; do
    IFS="|" read -r remote_suffix local_os local_arch file_ext <<< "$platform_info"

    ZIP_FILE="sqlean-$remote_suffix.zip"
    URL="https://github.com/nalgeon/sqlean/releases/download/$VERSION/$ZIP_FILE"

    echo "Downloading $URL..."
    curl -L -o "$TMP_DIR/$ZIP_FILE" "$URL"

    EXTRACT_DIR="$TMP_DIR/$remote_suffix"
    mkdir -p "$EXTRACT_DIR"
    unzip -o "$TMP_DIR/$ZIP_FILE" -d "$EXTRACT_DIR"

    # Process each .so/.dylib/.dll file in the zip
    find "$EXTRACT_DIR" -maxdepth 1 -type f \( -name "*.$file_ext" \) | while read -r ext_file; do
        ext_name=$(basename "$ext_file" ".$file_ext")

        # Target directory structure: ./extensions/sqlean-<extname>-<version>/<extname>-<version>-<os>-<arch>.<ext>
        TARGET_SUBDIR="$EXTENSIONS_DIR/sqlean-$ext_name-$VERSION"
        mkdir -p "$TARGET_SUBDIR"

        TARGET_FILE="$ext_name-$VERSION-$local_os-$local_arch.$file_ext"
        echo "Organizing $ext_name into $TARGET_SUBDIR/$TARGET_FILE"
        cp "$ext_file" "$TARGET_SUBDIR/$TARGET_FILE"

        # Create info.json if it doesn't exist
        if [ ! -f "$TARGET_SUBDIR/info.json" ]; then
            case $ext_name in
                crypto)
                    desc="SQLite Cryptographic Functions (hashes, signatures, encryption)"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/crypto.md"
                    ;;
                fileio)
                    desc="Read and write files from SQLite"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/fileio.md"
                    ;;
                fuzzy)
                    desc="Fuzzy string matching (Soundex, Levenshtein, etc.)"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/fuzzy.md"
                    ;;
                ipaddr)
                    desc="IP address manipulation and comparison"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/ipaddr.md"
                    ;;
                math)
                    desc="Advanced mathematical functions"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/math.md"
                    ;;
                regexp)
                    desc="Regular expression support (search, replace, split)"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/regexp.md"
                    ;;
                stats)
                    desc="Statistical functions (median, percentile, stddev)"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/stats.md"
                    ;;
                text)
                    desc="Advanced text manipulation functions"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/text.md"
                    ;;
                unicode)
                    desc="Unicode support and character properties"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/unicode.md"
                    ;;
                uuid)
                    desc="UUID generation and manipulation"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/uuid.md"
                    ;;
                vsv)
                    desc="CSV/TSV file as a virtual table"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/vsv.md"
                    ;;
                define)
                    desc="Define custom functions directly in SQL"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/define.md"
                    ;;
                time)
                    desc="High-precision date/time in SQLite"
                    url="https://github.com/nalgeon/sqlean/blob/main/docs/time.md"
                    ;;
                sqlean)
                    desc="Pre bundled all sqlean extensions"
                    url="https://github.com/nalgeon/sqlean/blob/main/README.md"
                    ;;
                *)
                    desc="SQLite extension"
                    url="https://github.com/nalgeon/sqlean"
                    ;;
            esac

            # Use printf to avoid escaping issues and ensure proper JSON
            cat <<EOF > "$TARGET_SUBDIR/info.json"
{
  "description": "$desc",
  "documentation_url": "$url"
}
EOF
        fi
    done
done

# Clean up
rm -rf "$TMP_DIR"

echo "Done! Extensions organized in $EXTENSIONS_DIR"
