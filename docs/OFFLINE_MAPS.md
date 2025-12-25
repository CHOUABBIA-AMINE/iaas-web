# Offline Maps Implementation Guide

## Overview

This guide explains how to make Leaflet maps work offline by serving map tiles locally instead of fetching them from online tile servers like OpenStreetMap.

## Table of Contents

1. [Understanding Map Tiles](#understanding-map-tiles)
2. [Options for Offline Maps](#options-for-offline-maps)
3. [Recommended Solution](#recommended-solution)
4. [Implementation Steps](#implementation-steps)
5. [Storage Requirements](#storage-requirements)
6. [Alternative Solutions](#alternative-solutions)

---

## Understanding Map Tiles

Leaflet maps are composed of small square images (tiles) that are loaded dynamically based on the map's zoom level and position. Each zoom level requires exponentially more tiles.

### Tile Structure
- **Zoom Level 0**: 1 tile (entire world)
- **Zoom Level 6**: 4,096 tiles
- **Zoom Level 10**: 1,048,576 tiles
- **Zoom Level 18**: 68,719,476,736 tiles

---

## Options for Offline Maps

### Option 1: Pre-downloaded Tiles (Recommended for Production)
### Option 2: Self-hosted Tile Server
### Option 3: MBTiles Format
### Option 4: Vector Tiles

---

## Recommended Solution

### Using Leaflet.TileLayer.Fallback with Local Tiles

## Implementation Steps

### Step 1: Download Map Tiles

#### Using MOBAC (Mobile Atlas Creator)

1. **Download MOBAC**:
   ```bash
   # Download from: https://mobac.sourceforge.io/
   wget https://sourceforge.net/projects/mobac/files/Mobile%20Atlas%20Creator/
   ```

2. **Configure for Algeria**:
   - Set map source to OpenStreetMap
   - Define bounding box for Algeria:
     - North: 37.5°
     - South: 19°
     - West: -8.7°
     - East: 12°
   - Select zoom levels (6-12 recommended)

3. **Export Format**: Choose "OSM Tiles" or "MBTiles"

#### Using TileMill or Maperitive

Alternatively, use TileMill or Maperitive for more control over styling.

---

### Step 2: Organize Tiles Locally

```
public/
└── tiles/
    └── algeria/
        ├── 6/
        │   ├── 30/
        │   │   ├── 20.png
        │   │   ├── 21.png
        │   │   └── ...
        │   └── 31/
        ├── 7/
        ├── 8/
        └── ...
```

---

### Step 3: Create Offline Tile Layer Component

**File**: `src/modules/network/geo/components/OfflineTileLayer.tsx`

```typescript
import { TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';

interface OfflineTileLayerProps {
  offlineUrl?: string;
  onlineUrl?: string;
  attribution?: string;
  maxZoom?: number;
  minZoom?: number;
}

export const OfflineTileLayer: React.FC<OfflineTileLayerProps> = ({
  offlineUrl = '/tiles/algeria/{z}/{x}/{y}.png',
  onlineUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; OpenStreetMap contributors',
  maxZoom = 12,
  minZoom = 6
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [useOffline, setUseOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if offline tiles are available
    fetch(offlineUrl.replace('{z}', '6').replace('{x}', '30').replace('{y}', '20'))
      .then(() => setUseOffline(true))
      .catch(() => setUseOffline(false));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineUrl]);

  // Use offline tiles if available or if offline
  const tileUrl = (!isOnline || useOffline) ? offlineUrl : onlineUrl;

  return (
    <TileLayer
      attribution={attribution}
      url={tileUrl}
      maxZoom={maxZoom}
      minZoom={minZoom}
      errorTileUrl="/tiles/placeholder.png" // Fallback for missing tiles
    />
  );
};
```

---

### Step 4: Update MapView Component

**File**: `src/modules/network/geo/components/MapView.tsx`

```typescript
import { OfflineTileLayer } from './OfflineTileLayer';

// Replace the existing TileLayer with:
<OfflineTileLayer
  offlineUrl="/tiles/algeria/{z}/{x}/{y}.png"
  onlineUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; OpenStreetMap contributors'
  maxZoom={12}
  minZoom={6}
/>
```

---

### Step 5: Add Offline Indicator

**File**: `src/modules/network/geo/components/OfflineIndicator.tsx`

```typescript
import { Box, Chip } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const OfflineIndicator: React.FC = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000
      }}
    >
      {!isOnline && (
        <Chip
          icon={<WifiOffIcon />}
          label={t('map.offlineMode')}
          color="warning"
          size="small"
        />
      )}
    </Box>
  );
};
```

---

## Storage Requirements

### Estimated Storage per Country (Algeria)

| Zoom Level | Tiles Count | Storage Size |
|------------|-------------|-------------|
| 6          | ~500        | 2 MB        |
| 7          | ~2,000      | 8 MB        |
| 8          | ~8,000      | 32 MB       |
| 9          | ~32,000     | 128 MB      |
| 10         | ~130,000    | 520 MB      |
| 11         | ~520,000    | 2 GB        |
| 12         | ~2,000,000  | 8 GB        |

**Recommendation**: Use zoom levels 6-10 (total ~700 MB)

---

## Alternative Solutions

### Option A: MBTiles with SQLite

Use MBTiles format with a tile server:

```bash
# Install tileserver-gl
npm install -g tileserver-gl-light

# Serve MBTiles file
tileserver-gl-light algeria.mbtiles
```

Then use in React:
```typescript
<TileLayer url="http://localhost:8080/styles/basic/{z}/{x}/{y}.png" />
```

### Option B: Self-hosted Tile Server

Set up your own tile server with:
- **OpenMapTiles** + **TileServer GL**
- **Mapnik** + **Mod_tile** + **Apache**
- **Tegola** (for vector tiles)

### Option C: Service Workers for Caching

Implement service worker to cache tiles automatically:

```javascript
// public/service-worker.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open('map-tiles').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
```

---

## Implementation Checklist

- [ ] Download tiles for required region
- [ ] Set up local tile directory structure
- [ ] Create OfflineTileLayer component
- [ ] Update MapView to use offline tiles
- [ ] Add offline indicator UI
- [ ] Test offline functionality
- [ ] Add fallback placeholder tile
- [ ] Update i18n with offline messages
- [ ] Document tile update process
- [ ] Set up tile versioning strategy

---

## Tools & Resources

### Tile Download Tools
- **MOBAC**: https://mobac.sourceforge.io/
- **MapTiler**: https://www.maptiler.com/
- **TileMill**: https://tilemill-project.github.io/tilemill/

### Tile Servers
- **TileServer GL**: https://github.com/maptiler/tileserver-gl
- **Tegola**: https://tegola.io/
- **OpenMapTiles**: https://openmaptiles.org/

### Documentation
- **Leaflet Offline**: https://github.com/allartk/leaflet.offline
- **Leaflet TileLayer**: https://leafletjs.com/reference.html#tilelayer

---

## Notes

- **Legal**: Ensure compliance with OpenStreetMap license (ODbL)
- **Updates**: Plan for periodic tile updates
- **Performance**: Consider CDN for faster tile delivery
- **Compression**: Use PNG optimization to reduce storage
