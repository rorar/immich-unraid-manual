#!/usr/bin/env bash
set -euo pipefail

# Google Takeout Archive Extractor with Verification
# Extracts all takeout-*.tgz archives and verifies each file on disk.

TARGET="${1:-$(pwd)}"
cd "$TARGET"

ARCHIVES=(takeout-*.tgz)
if [ ! -e "${ARCHIVES[0]}" ]; then
  echo "No takeout-*.tgz files found in $TARGET"
  exit 1
fi

echo "Found ${#ARCHIVES[@]} archive(s) in $TARGET"
echo ""

TOTAL_FAIL=0

for f in "${ARCHIVES[@]}"; do
  echo "================================================"
  echo "Extracting: $f"
  echo "================================================"

  if ! tar -xzf "$f" -C "$TARGET"; then
    echo "WARNING: tar reported errors during extraction of $f"
  fi

  echo "Verifying: $f"
  MISSING=()
  EXPECTED=0
  while IFS= read -r entry; do
    EXPECTED=$((EXPECTED + 1))
    if [ ! -e "$TARGET/$entry" ]; then
      MISSING+=("$entry")
    fi
  done < <(tar -tzf "$f" 2>/dev/null)

  MISSING_COUNT=${#MISSING[@]}
  VERIFIED=$((EXPECTED - MISSING_COUNT))

  if [ "$MISSING_COUNT" -eq 0 ]; then
    echo "OK: $f - all $EXPECTED files verified."
  else
    echo "WARNING: $f - $MISSING_COUNT of $EXPECTED files missing!"
    echo "Missing files:"
    for m in "${MISSING[@]}"; do
      echo "  - $m"
    done
    TOTAL_FAIL=1
  fi
  echo ""
done

echo "================================================"
if [ "$TOTAL_FAIL" -eq 0 ]; then
  echo "All archives extracted and verified successfully."
else
  echo "WARNING: Some archives had missing files. Check the output above."
fi
echo "================================================"
echo ""
echo "Press Enter to close."
read -r
