# Tile Mode Toggle Feature

## Overview

This feature adds manual user control for switching between online and offline map tile sources in the infrastructure visualization map. Previously, the application automatically detected network connectivity and tile availability. Now users can manually override this behavior with a convenient toggle switch.

## Changes Made

### 1. Updated Components

#### `OfflineTileLayer.tsx`
- **Added**: `forceOffline` prop to allow manual control
- **Added**: `onOfflineAvailabilityChange` callback to notify parent components
- **Modified**: Logic now respects user preference when network is available
- **Enhanced**: Added `key` prop to TileLayer to force re-render when URL changes

**Key Props:**
- `forceOffline?: boolean` - When true, forces the use of offline tiles (if available)
- `onOfflineAvailabilityChange?: (available: boolean) => void` - Callback fired when offline tile availability is detected

#### `MapView.tsx`
- **Added**: State management for tile mode (`useOfflineMode`)
- **Added**: Tracking of offline tiles availability
- **Added**: Network status monitoring
- **Integrated**: `TileModeToggle` component
- **Updated**: Passed `forceOffline` prop to `OfflineTileLayer`

### 2. New Component: `TileModeToggle.tsx`

A user-friendly toggle control positioned on the map that allows switching between online and offline tile sources.

**Features:**
- Visual switch with icons (Wifi/Cloud)
- Status chips showing network state or tile availability
- Tooltips with helpful information
- Smart disabling logic:
  - Disabled when neither mode is available
  - Prevents switching to offline when tiles aren't available
  - Automatically uses offline when network is down

**Props:**
```typescript
interface TileModeToggleProps {
  useOfflineMode: boolean;           // Current mode
  onModeChange: (useOffline: boolean) => void;  // Change handler
  offlineTilesAvailable: boolean;    // Tile availability
  isNetworkOnline: boolean;          // Network status
}
```

**Visual Design:**
- Positioned at top-right of map (below map controls)
- Material-UI Paper component with elevation
- Switch component with custom icons
- Status chips for important states
- Responsive tooltips

### 3. Updated Exports

**`src/modules/network/geo/components/index.ts`**
- Added export for `TileModeToggle`

### 4. Translation Updates

**`src/shared/i18n/locales/en.json`**

Added new translation keys under `map.network` and `map.tiles`:

```json
"map": {
  "network": {
    "offline": "Network Offline",
    "online": "Network Online"
  },
  "tiles": {
    "online": "Online",
    "offline": "Offline",
    "notAvailable": "Offline tiles not available",
    "offlineOnly": "Network is offline - using local tiles",
    "offlineNotAvailable": "Offline tiles are not available",
    "switchToOnline": "Switch to online map tiles",
    "switchToOffline": "Switch to offline map tiles"
  }
}
```

## How It Works

### Tile Selection Logic

1. **Network Offline**: Automatically uses offline tiles (no choice)
2. **Network Online + User Selects Offline**: Uses offline tiles if available
3. **Network Online + User Selects Online**: Uses online tiles
4. **Offline Tiles Not Available**: Cannot switch to offline mode

### User Flow

1. User opens the map at `/network/map`
2. Toggle control appears in top-right corner
3. Default mode: Online (when network is available)
4. User clicks toggle switch
5. Map tiles reload with selected source
6. Selection persists during session

### Visual Feedback

- **Switch Position**: Shows current mode (left=online, right=offline)
- **Icons**: Wifi (online) / Cloud (offline)
- **Status Chips**: 
  - "Network Offline" (warning) - when no network
  - "Offline tiles not available" (info) - when offline tiles missing
- **Tooltips**: Contextual help messages

## Usage Example

```typescript
<MapView>
  {/* Inside MapContainer */}
  <OfflineTileLayer
    offlineUrl="/tiles/algeria/{z}/{x}/{y}.png"
    onlineUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    forceOffline={useOfflineMode}
    onOfflineAvailabilityChange={setOfflineTilesAvailable}
  />
  
  {/* Outside MapContainer */}
  <TileModeToggle
    useOfflineMode={useOfflineMode}
    onModeChange={setUseOfflineMode}
    offlineTilesAvailable={offlineTilesAvailable}
    isNetworkOnline={isNetworkOnline}
  />
</MapView>
```

## Benefits

1. **User Control**: Users can choose their preferred tile source
2. **Bandwidth Savings**: Use offline tiles even when online to save bandwidth
3. **Performance**: Offline tiles typically load faster
4. **Flexibility**: Works in both online and offline scenarios
5. **Transparency**: Clear visual indicators of current mode and available options

## Future Enhancements

Possible improvements:
- Persist user preference in localStorage
- Add more tile source options (satellite, terrain, etc.)
- Implement tile caching for online tiles
- Add download progress for offline tile packages
- Support for custom tile servers

## Testing

### Manual Testing Checklist

- [ ] Toggle switch appears on map page
- [ ] Switch changes from online to offline mode
- [ ] Tiles reload when switching modes
- [ ] Offline mode disabled when tiles not available
- [ ] Online mode works when network available
- [ ] Automatic offline when network disconnects
- [ ] Status chips show correct information
- [ ] Tooltips display helpful messages
- [ ] Switch state matches actual tile source
- [ ] Icons update correctly

### Test Scenarios

1. **Normal Operation**: Start online → switch to offline → switch back
2. **No Offline Tiles**: Try to enable offline mode without tiles
3. **Network Loss**: Go offline while in online mode
4. **Network Recovery**: Come back online while in offline mode
5. **Session Persistence**: Refresh page and check mode

## Technical Notes

- Toggle uses Material-UI `Switch` component
- Icons from `@mui/icons-material`
- Positioning uses absolute positioning with z-index 1000
- Network status monitored via browser `online`/`offline` events
- Tile availability checked via HEAD request to sample tile
- Component is fully responsive and works with RTL layouts

## Commits

1. `feat: Add manual toggle for online/offline tile selection` - Updated OfflineTileLayer
2. `feat: Add TileModeToggle component for user control` - Created new toggle component
3. `feat: Integrate TileModeToggle into MapView` - Connected components
4. `feat: Export TileModeToggle component` - Updated exports
5. `feat: Add translation keys for tile mode toggle` - Added i18n support
6. `docs: Add documentation for tile mode toggle feature` - This document

## Author

CHOUABBIA Amine  
Date: December 25, 2025
