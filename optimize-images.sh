#!/bin/bash

# Image Optimization Script for Queer Durham Game
# Requires imagemagick (install via: brew install imagemagick)

echo "======================================"
echo "Queer Durham Image Optimization Script"
echo "======================================"
echo ""

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed."
    echo "Install it with: brew install imagemagick"
    echo ""
    echo "Or on Linux: sudo apt-get install imagemagick"
    exit 1
fi

# Use 'magick convert' on newer versions, 'convert' on older
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick convert"
else
    CONVERT_CMD="convert"
fi

# Create backup directory
BACKUP_DIR="assets_backup_$(date +%Y%m%d_%H%M%S)"
echo "Creating backup at: $BACKUP_DIR"
cp -r assets "$BACKUP_DIR"
echo "✓ Backup created"
echo ""

# Optimization settings
QUALITY=85  # Good balance between quality and file size
MAX_WIDTH=2048  # Max width for large images

echo "Optimizing images..."
echo "Quality: $QUALITY%"
echo "Max width: ${MAX_WIDTH}px"
echo ""

# Function to optimize a PNG file
optimize_png() {
    local file="$1"
    local original_size=$(wc -c < "$file")

    # Get image dimensions
    local width=$(identify -format "%w" "$file" 2>/dev/null)

    if [ -z "$width" ]; then
        echo "⚠ Skipping $file (unable to read)"
        return
    fi

    # Resize if too large, then optimize
    if [ "$width" -gt "$MAX_WIDTH" ]; then
        $CONVERT_CMD "$file" -resize "${MAX_WIDTH}x>" -strip -quality $QUALITY "$file.tmp"
    else
        $CONVERT_CMD "$file" -strip -quality $QUALITY "$file.tmp"
    fi

    # Only replace if optimization was successful and resulted in smaller file
    if [ -f "$file.tmp" ]; then
        local new_size=$(wc -c < "$file.tmp")

        if [ "$new_size" -lt "$original_size" ]; then
            mv "$file.tmp" "$file"
            local saved=$((original_size - new_size))
            local percent=$((saved * 100 / original_size))
            printf "✓ %-60s %8s → %8s (-%d%%)\n" \
                "$(basename "$file")" \
                "$(numfmt --to=iec --suffix=B $original_size)" \
                "$(numfmt --to=iec --suffix=B $new_size)" \
                "$percent"
        else
            rm "$file.tmp"
            printf "- %-60s %8s (no improvement)\n" \
                "$(basename "$file")" \
                "$(numfmt --to=iec --suffix=B $original_size)"
        fi
    fi
}

# Special handling for BackgroundMap (very large)
echo "=== Background Map ==="
if [ -f "assets/BackgroundMap.png" ]; then
    optimize_png "assets/BackgroundMap.png"
fi
echo ""

# Optimize building images
echo "=== Building Images (SitesTitle) ==="
find assets/SitesTitle -name "*.png" -type f | while read file; do
    optimize_png "$file"
done
echo ""

echo "=== Building Images (SitesNoTitle) ==="
find assets/SitesNoTitle -name "*.png" -type f | while read file; do
    optimize_png "$file"
done
echo ""

echo "=== Building Images (PlainBuildings) ==="
find assets/PlainBuildings -name "*.png" -type f | while read file; do
    optimize_png "$file"
done
echo ""

# Optimize other assets
echo "=== Other Assets ==="
find assets/bustsprite assets/objects assets/legend -name "*.png" -type f 2>/dev/null | while read file; do
    optimize_png "$file"
done
echo ""

# Calculate total savings
ORIGINAL_SIZE=$(du -sb "$BACKUP_DIR" | cut -f1)
CURRENT_SIZE=$(du -sb assets | cut -f1)
SAVED=$((ORIGINAL_SIZE - CURRENT_SIZE))
PERCENT=$((SAVED * 100 / ORIGINAL_SIZE))

echo "======================================"
echo "Optimization Complete!"
echo "======================================"
echo "Original size: $(numfmt --to=iec --suffix=B $ORIGINAL_SIZE)"
echo "New size:      $(numfmt --to=iec --suffix=B $CURRENT_SIZE)"
echo "Saved:         $(numfmt --to=iec --suffix=B $SAVED) (-${PERCENT}%)"
echo ""
echo "Backup location: $BACKUP_DIR"
echo "If everything looks good, you can delete the backup:"
echo "  rm -rf $BACKUP_DIR"
