#!/usr/bin/env python3
"""
Map Tiles Downloader for Algeria
Downloads OpenStreetMap tiles for offline use

Usage:
    python scripts/download-tiles.py --output public/tiles/algeria --zoom 6-10

Requirements:
    pip install requests pillow tqdm
"""

import argparse
import os
import sys
import time
import math
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from tqdm import tqdm

# OpenStreetMap tile server
TILE_SERVER = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

# User agent (required by OSM tile usage policy)
USER_AGENT = "IAAS-Web-Offline-Maps/1.0"

# Algeria bounding box
ALGERIA_BOUNDS = {
    'north': 37.5,
    'south': 19.0,
    'west': -8.7,
    'east': 12.0
}

def deg2num(lat_deg, lon_deg, zoom):
    """Convert lat/lon to tile coordinates"""
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return (xtile, ytile)

def get_tile_range(bounds, zoom):
    """Get tile range for given bounds and zoom level"""
    x_min, y_max = deg2num(bounds['north'], bounds['west'], zoom)
    x_max, y_min = deg2num(bounds['south'], bounds['east'], zoom)
    return (x_min, x_max, y_min, y_max)

def download_tile(z, x, y, output_dir, session):
    """Download a single tile"""
    # Create directory structure
    tile_dir = Path(output_dir) / str(z) / str(x)
    tile_dir.mkdir(parents=True, exist_ok=True)
    
    tile_path = tile_dir / f"{y}.png"
    
    # Skip if tile already exists
    if tile_path.exists():
        return True, "exists"
    
    # Download tile
    url = TILE_SERVER.format(z=z, x=x, y=y)
    
    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()
        
        # Save tile
        with open(tile_path, 'wb') as f:
            f.write(response.content)
        
        # Respect tile server usage policy (max 2 requests/second)
        time.sleep(0.5)
        
        return True, "downloaded"
    
    except requests.exceptions.RequestException as e:
        return False, str(e)

def calculate_total_tiles(zoom_min, zoom_max, bounds):
    """Calculate total number of tiles to download"""
    total = 0
    for z in range(zoom_min, zoom_max + 1):
        x_min, x_max, y_min, y_max = get_tile_range(bounds, z)
        total += (x_max - x_min + 1) * (y_max - y_min + 1)
    return total

def download_tiles(zoom_min, zoom_max, output_dir, bounds, max_workers=4):
    """Download all tiles for specified zoom levels"""
    
    # Calculate total tiles
    total_tiles = calculate_total_tiles(zoom_min, zoom_max, bounds)
    print(f"Total tiles to download: {total_tiles:,}")
    print(f"Estimated size: {total_tiles * 4 / 1024:.1f} MB\n")
    
    # Create output directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Create session with custom headers
    session = requests.Session()
    session.headers.update({
        'User-Agent': USER_AGENT
    })
    
    # Download tiles
    downloaded = 0
    skipped = 0
    failed = 0
    
    with tqdm(total=total_tiles, desc="Downloading tiles") as pbar:
        for z in range(zoom_min, zoom_max + 1):
            x_min, x_max, y_min, y_max = get_tile_range(bounds, z)
            
            print(f"\nZoom level {z}: {(x_max-x_min+1)*(y_max-y_min+1):,} tiles")
            
            tasks = []
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                for x in range(x_min, x_max + 1):
                    for y in range(y_min, y_max + 1):
                        task = executor.submit(download_tile, z, x, y, output_dir, session)
                        tasks.append(task)
                
                for future in as_completed(tasks):
                    success, status = future.result()
                    
                    if success:
                        if status == "exists":
                            skipped += 1
                        else:
                            downloaded += 1
                    else:
                        failed += 1
                        tqdm.write(f"Failed: {status}")
                    
                    pbar.update(1)
    
    print(f"\n\nDownload complete!")
    print(f"Downloaded: {downloaded:,} tiles")
    print(f"Skipped (existing): {skipped:,} tiles")
    print(f"Failed: {failed:,} tiles")
    print(f"\nTiles saved to: {output_dir}")

def main():
    parser = argparse.ArgumentParser(
        description='Download OpenStreetMap tiles for offline use'
    )
    parser.add_argument(
        '--output',
        default='public/tiles/algeria',
        help='Output directory for tiles (default: public/tiles/algeria)'
    )
    parser.add_argument(
        '--zoom',
        default='6-10',
        help='Zoom level range (default: 6-10)'
    )
    parser.add_argument(
        '--bbox',
        help='Bounding box as: south,west,north,east (default: Algeria)'
    )
    parser.add_argument(
        '--workers',
        type=int,
        default=4,
        help='Number of parallel download workers (default: 4)'
    )
    
    args = parser.parse_args()
    
    # Parse zoom levels
    if '-' in args.zoom:
        zoom_min, zoom_max = map(int, args.zoom.split('-'))
    else:
        zoom_min = zoom_max = int(args.zoom)
    
    # Parse bounding box
    if args.bbox:
        south, west, north, east = map(float, args.bbox.split(','))
        bounds = {
            'north': north,
            'south': south,
            'west': west,
            'east': east
        }
    else:
        bounds = ALGERIA_BOUNDS
    
    print("OpenStreetMap Tile Downloader")
    print("="*50)
    print(f"Output directory: {args.output}")
    print(f"Zoom levels: {zoom_min} to {zoom_max}")
    print(f"Bounding box: {bounds}")
    print(f"Parallel workers: {args.workers}")
    print("="*50)
    print()
    
    # Confirm before downloading
    try:
        input("Press Enter to start download (Ctrl+C to cancel)...")
    except KeyboardInterrupt:
        print("\nCancelled.")
        sys.exit(0)
    
    # Download tiles
    download_tiles(zoom_min, zoom_max, args.output, bounds, args.workers)

if __name__ == '__main__':
    main()
