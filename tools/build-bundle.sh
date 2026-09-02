#!/usr/bin/env bash
# Builds HSS.zip — a self-contained handover folder that unzips to HSS/.
# Usage: bash tools/build-bundle.sh [output-dir]
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/dist}"
STAGE="$OUT/stage"
rm -rf "$STAGE" && mkdir -p "$STAGE/HSS/Demo" "$STAGE/HSS/Source"

# documentation -> readable PDFs
python3 "$ROOT/tools/md_to_html.py" "$ROOT/docs/architecture.md" "$STAGE/Platform Architecture.html" "Platform Architecture"
python3 "$ROOT/tools/md_to_html.py" "$ROOT/README.md"            "$STAGE/Overview.html"              "Overview"
node "$ROOT/tools/html_to_pdf.js" "$STAGE" "Platform Architecture" "Overview"
mv "$STAGE/Platform Architecture.pdf" "$STAGE/Overview.pdf" "$STAGE/HSS/"
rm -f "$STAGE"/*.html

cp "$ROOT/presentation/Orpheus-Hospitality-Suite.pptx" "$STAGE/HSS/Hospitality Solutions Deck.pptx"
cp "$ROOT/presentation/Orpheus-Hospitality-Suite.pdf"  "$STAGE/HSS/Hospitality Solutions Deck.pdf"
cp "$ROOT/demo/index.html"                             "$STAGE/HSS/Demo/index.html"
cp "$ROOT/docs/architecture.md" "$ROOT/README.md" "$ROOT/presentation/build_deck.js" "$STAGE/HSS/Source/"
cp "$ROOT/tools/START-HERE.txt" "$STAGE/HSS/START HERE.txt"

( cd "$STAGE" && zip -qr "$OUT/HSS.zip" HSS )
rm -rf "$STAGE"
echo "Built $OUT/HSS.zip"
