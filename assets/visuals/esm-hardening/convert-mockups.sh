#!/bin/bash

# ESM Hardening Visual Assets Conversion Script
# This script converts SVG mockups to PNG and WebP formats

# Ensure we're in the correct directory
cd "$(dirname "$0")"

echo "🎨 Converting ESM Hardening Visual Mockups..."

# Check for required tools
command -v inkscape >/dev/null 2>&1 || { echo ❌ "Inkscape is required but not installed. Aborting." >&2; exit 1; }
command -v cwebp >/dev/null 2>&1 || { echo ❌ "cwebp (WebP tools) is required but not installed. Aborting." >&2; exit 1; }

# Convert SVG to PNG (high resolution)
echo "📐 Converting to PNG (high resolution)..."
inkscape --export-type=png --export-dpi=300 --export-filename=vault-door_poster.png vault-door_poster.svg
inkscape --export-type=png --export-dpi=300 --export-filename=scroll_story.png scroll_story.svg
inkscape --export-type=png --export-dpi=300 --export-filename=sigil_feed.png sigil_feed.svg

# Convert PNG to WebP (optimized for web)
echo "🌐 Converting to WebP (web optimized)..."
cwebp -q 85 vault-door_poster.png -o vault-door_poster.webp
cwebp -q 85 scroll_story.png -o scroll_story.webp
cwebp -q 85 sigil_feed.png -o sigil_feed.webp

echo "✅ Conversion complete!"
echo ""
echo "📁 Generated files:"
echo "   🏛️  vault-door_poster.png & vault-door_poster.webp"
echo "   📜 scroll_story.png & scroll_story.webp"
echo "   🔮 sigil_feed.png & sigil_feed.webp"
echo ""
echo "📊 File sizes:"
ls -lh *.png *.webp | grep -E "\.(png|webp)$"