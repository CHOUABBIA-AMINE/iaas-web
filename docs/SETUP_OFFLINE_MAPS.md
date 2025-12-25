# Offline Maps Setup Guide

## Quick Start

This guide will help you set up offline map tiles for Algeria (zoom levels 6-10, ~690 MB).

## Prerequisites

- Python 3.7+ (for tile download script)
- ~1 GB free disk space
- Internet connection (for initial download)

## Step-by-Step Setup

### 1. Install Python Dependencies

```bash
pip install requests pillow tqdm
```

### 2. Download Map Tiles

#### Option A: Using the Python Script (Recommended)

```bash
# From project root
python scripts/download-tiles.py \
  --output public/tiles/algeria \
  --zoom 6-10 \
  --workers 4
```

This will:
- Download ~171,000 tiles
- Take approximately 30-60 minutes
- Use ~690 MB of disk space
- Respect OSM tile usage policy (rate limiting)

#### Option B: Using MOBAC (GUI Tool)

1. Download MOBAC from: https://mobac.sourceforge.io/

2. Run MOBAC:
   ```bash
   java -jar Mobile_Atlas_Creator.jar
   ```

3. Configure:
   - **Map Source**: OpenStreetMap Mapnik
   - **Zoom Levels**: 6 to 10
   - **Format**: PNG tiles in OSM structure

4. Select Region:
   - Draw rectangle covering Algeria:
     - North: 37.5°
     - South: 19.0°
     - West: -8.7°
     - East: 12.0°

5. Create Atlas:
   - Name: "algeria"
   - Click "Create Atlas"

6. Copy tiles to project:
   ```bash
   cp -r atlases/algeria/* public/tiles/algeria/
   ```

### 3. Verify Installation

Check that tiles are properly organized:

```bash
# Should show zoom level directories
ls public/tiles/algeria/
# Output: 6  7  8  9  10

# Check a specific tile exists
ls public/tiles/algeria/6/30/20.png
# Should exist
```

### 4. Test Offline Maps

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the map page:
   ```
   http://localhost:3000/network/map
   ```

3. Test offline mode:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Click "Offline" to simulate offline mode
   - Refresh the page
   - Map should load from local tiles

4. Check console for:
   ```
   TileLayer mode: OFFLINE
   Offline tiles: Available
   ```

### 5. Optimize Tiles (Optional)

Reduce tile size by 20-40%:

```bash
# Using optipng (lossless)
find public/tiles/algeria -name '*.png' -exec optipng -o7 {} \;

# Or using pngquant (lossy, smaller)
find public/tiles/algeria -name '*.png' -exec pngquant --ext .png --force {} \;
```

## Production Deployment

### Option 1: Include Tiles in Build

```bash
# Tiles will be copied to build directory
npm run build

# Deploy with tiles included
# Note: This increases deployment size by ~690 MB
```

### Option 2: Serve from CDN

1. Upload tiles to CDN:
   ```bash
   aws s3 sync public/tiles/algeria s3://your-bucket/tiles/algeria/ --acl public-read
   ```

2. Update tile URL in code:
   ```typescript
   <OfflineTileLayer
     offlineUrl="https://cdn.yourdomain.com/tiles/algeria/{z}/{x}/{y}.png"
   />
   ```

### Option 3: Self-hosted Tile Server

For better performance, use a dedicated tile server:

```bash
# Using tileserver-gl
npm install -g tileserver-gl-light
tileserver-gl-light public/tiles/algeria
```

## Storage Requirements

| Zoom Levels | Tiles | Size | Use Case |
|-------------|-------|------|----------|
| 6-8 | 11,000 | 44 MB | Country overview |
| 6-9 | 43,000 | 172 MB | Regional detail |
| 6-10 | 171,000 | 684 MB | City detail (Recommended) |
| 6-11 | 684,000 | 2.7 GB | Street level |
| 6-12 | 2.7M | 10.8 GB | Building level |

## Updating Tiles

To update with latest OSM data:

```bash
# Remove old tiles
rm -rf public/tiles/algeria/*

# Re-download
python scripts/download-tiles.py --output public/tiles/algeria --zoom 6-10
```

Recommend updating:
- **Monthly** for urban areas
- **Quarterly** for rural areas
- **On-demand** after major infrastructure changes

## Troubleshooting

### Tiles Not Loading

**Problem**: Map shows blank tiles

**Solutions**:
1. Check browser console for errors
2. Verify file permissions:
   ```bash
   chmod -R 755 public/tiles/
   ```
3. Check tile path in browser:
   ```
   http://localhost:3000/tiles/algeria/6/30/20.png
   ```
   Should display an image

### Download Script Fails

**Problem**: Script errors or timeouts

**Solutions**:
1. Check internet connection
2. Reduce workers: `--workers 2`
3. Download in smaller ranges:
   ```bash
   python scripts/download-tiles.py --zoom 6-8
   python scripts/download-tiles.py --zoom 9-10
   ```

### Out of Disk Space

**Problem**: Not enough space for tiles

**Solutions**:
1. Use lower zoom levels: `--zoom 6-8` (44 MB)
2. Optimize tiles with pngquant (reduces by 50%)
3. Use external storage or CDN

### Slow Map Performance

**Problem**: Map is slow to load tiles

**Solutions**:
1. Optimize tiles (see step 5)
2. Use HTTP caching headers
3. Enable gzip compression on server
4. Use CDN for tile delivery

## Legal & License

### OpenStreetMap License

- **Data**: ODbL (Open Database License)
- **Tiles**: CC BY-SA 2.0
- **Attribution Required**: © OpenStreetMap contributors

### Usage Policy

When using OSM tiles:
- Include proper attribution
- Respect rate limits during download
- Don't redistribute tiles commercially without permission
- See: https://operations.osmfoundation.org/policies/tiles/

## Support

For help:
- Documentation: `docs/OFFLINE_MAPS.md`
- GitHub Issues: https://github.com/CHOUABBIA-AMINE/iaas-web/issues
- OSM Tile Usage: https://wiki.openstreetmap.org/wiki/Tile_usage_policy

## Next Steps

- ☐ Download tiles for Algeria
- ☐ Test offline functionality
- ☐ Optimize tiles for production
- ☐ Set up CDN (optional)
- ☐ Configure automatic tile updates
- ☐ Monitor storage usage
