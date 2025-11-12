# Image Optimization Guide

## Current Issue
The game images are too large, causing slow loading and sometimes failing to load at all:
- **BackgroundMap.png**: 28MB (should be ~1-2MB max)
- **Building images**: 400KB-1MB each (should be ~50-100KB each)

## Solution: Optimize Images

### Option 1: Using the Optimization Script (Recommended)

1. **Install ImageMagick:**
   ```bash
   brew install imagemagick
   ```

2. **Run the optimization script:**
   ```bash
   ./optimize-images.sh
   ```

   This will:
   - Create a backup of your original assets
   - Resize images if they're too large (max 2048px width)
   - Compress all PNGs with 85% quality
   - Show you how much space was saved

3. **Test the game** to make sure images look good

4. **Delete the backup** if everything works:
   ```bash
   rm -rf assets_backup_*
   ```

### Option 2: Manual Optimization with Online Tools

If you don't want to install ImageMagick, you can use online tools:

1. **TinyPNG** (https://tinypng.com/)
   - Upload up to 20 images at a time
   - Download the optimized versions
   - Good for building images

2. **Squoosh** (https://squoosh.app/)
   - Google's image optimization tool
   - Great for the large BackgroundMap.png
   - Recommended settings:
     - Format: PNG or WebP
     - Quality: 85
     - Resize to max 2048px width

### Option 3: macOS Preview (Quick & Built-in)

For the BackgroundMap.png specifically:

1. Open BackgroundMap.png in Preview
2. Go to Tools → Adjust Size
3. Set width to 2048 pixels (keep "Scale proportionally" checked)
4. Click OK
5. Go to File → Export
6. Choose Format: PNG
7. Uncheck "Alpha" if image has no transparency
8. Save

## Expected Results

After optimization:
- **BackgroundMap.png**: 28MB → ~1-2MB (93-96% reduction)
- **Building images**: 400KB-1MB → ~50-150KB (70-85% reduction)
- **Total assets folder**: ~40-50MB → ~5-8MB (85-90% reduction)

## Benefits

- ✅ Faster page load times
- ✅ More reliable image loading (no timeouts)
- ✅ Better mobile experience
- ✅ Lower bandwidth costs
- ✅ All images will load consistently

## Technical Details

The optimization script:
- Strips unnecessary metadata from images
- Resizes overly large images to reasonable dimensions
- Compresses PNGs while maintaining visual quality
- Only replaces files if optimization actually reduces size
- Creates a timestamped backup for safety
