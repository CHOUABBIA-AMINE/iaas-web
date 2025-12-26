/**
 * Icon Factory
 * Factory functions for creating custom Leaflet marker icons
 * with representative SVG icons and colors for infrastructure types
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-26-2025
 */

import L from 'leaflet';

// Fix Leaflet default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Infrastructure type colors
 */
export const infrastructureColors = {
  station: '#1976D2',           // Deep Blue - Stations
  terminal: '#2E7D32',          // Dark Green - Terminals
  hydrocarbonField: '#F57C00',  // Deep Orange - Hydrocarbon Fields
  pipeline: '#7B1FA2',          // Deep Purple - Pipelines
  
  // Status colors
  operational: '#4CAF50',       // Green
  maintenance: '#FF9800',       // Orange
  offline: '#F44336',           // Red
  unknown: '#9E9E9E'            // Grey
};

/**
 * SVG icon paths for different infrastructure types
 */
const iconPaths = {
  // Station icon (factory/industrial building)
  station: `
    <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L17 10v8h-2v-6H9v6H7v-8l5-4.5z" 
          fill="white" transform="translate(-12,-12) scale(1.5)"/>
    <circle cx="0" cy="-2" r="2" fill="white"/>
  `,
  
  // Terminal icon (warehouse/storage)
  terminal: `
    <rect x="-8" y="-8" width="16" height="12" rx="1" fill="white"/>
    <path d="M-8,-8 L0,-12 L8,-8" fill="white"/>
    <rect x="-6" y="-5" width="4" height="4" fill="${infrastructureColors.terminal}"/>
    <rect x="2" y="-5" width="4" height="4" fill="${infrastructureColors.terminal}"/>
    <rect x="-3" y="0" width="6" height="3" fill="${infrastructureColors.terminal}"/>
  `,
  
  // Hydrocarbon Field icon (oil derrick)
  hydrocarbonField: `
    <path d="M-2,-10 L-2,6 M2,-10 L2,6 M-6,-6 L6,-6 M-4,-2 L4,-2 M-3,2 L3,2" 
          stroke="white" stroke-width="1.5" fill="none"/>
    <path d="M-3,-10 L0,-14 L3,-10 Z" fill="white"/>
    <circle cx="0" cy="-11" r="2" fill="white"/>
    <ellipse cx="0" cy="7" rx="5" ry="2" fill="white"/>
  `,
  
  // Pipeline icon (pipe connection)
  pipeline: `
    <rect x="-8" y="-2" width="16" height="4" rx="1" fill="white"/>
    <circle cx="-6" cy="0" r="3" fill="white" stroke="${infrastructureColors.pipeline}" stroke-width="1"/>
    <circle cx="6" cy="0" r="3" fill="white" stroke="${infrastructureColors.pipeline}" stroke-width="1"/>
    <path d="M-8,-2 L-8,2 M0,-2 L0,2 M8,-2 L8,2" stroke="${infrastructureColors.pipeline}" stroke-width="1.5"/>
  `
};

/**
 * Create SVG-based marker icon
 */
export const createSVGIcon = (
  iconType: keyof typeof iconPaths,
  color: string,
  size: 'small' | 'medium' | 'large' = 'medium',
  pulse: boolean = false
): L.DivIcon => {
  const sizes = {
    small: { width: 28, height: 38, iconScale: 0.8 },
    medium: { width: 35, height: 45, iconScale: 1.0 },
    large: { width: 42, height: 52, iconScale: 1.2 }
  };
  
  const { width, height, iconScale } = sizes[size];
  const iconPath = iconPaths[iconType];
  
  const pulseAnimation = pulse ? `
    <style>
      @keyframes marker-pulse {
        0% { opacity: 1; r: 0; }
        50% { opacity: 0.5; r: ${width / 2}; }
        100% { opacity: 0; r: ${width}; }
      }
      .pulse-ring {
        animation: marker-pulse 2s ease-out infinite;
      }
    </style>
    <circle class="pulse-ring" cx="${width / 2}" cy="${height - 10}" r="0" 
            fill="none" stroke="${color}" stroke-width="2"/>
  ` : '';
  
  return L.divIcon({
    className: 'custom-svg-marker',
    html: `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
           xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        ${pulseAnimation}
        
        <!-- Drop shadow -->
        <defs>
          <filter id="shadow-${iconType}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Marker pin shape -->
        <g filter="url(#shadow-${iconType})">
          <path d="M${width / 2},${height - 5} 
                   C${width / 2},${height - 5} 
                    ${width / 2 - 2},${height - 8} 
                    ${width / 2},${height - 10}
                   L${width / 2},${height - 10}
                   Q${width / 2},${height - 10} 
                    ${width / 2},${height - 10}
                   A${(width - 6) / 2},${(width - 6) / 2} 0 1,1 
                    ${width / 2},${height - 10}
                   Z" 
                fill="${color}" 
                stroke="white" 
                stroke-width="2.5"/>
          
          <!-- Icon content -->
          <g transform="translate(${width / 2}, ${height / 2 - 5}) scale(${iconScale})">
            ${iconPath}
          </g>
        </g>
      </svg>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, height - 5],
    popupAnchor: [0, -(height - 10)],
    className: 'leaflet-custom-icon'
  });
};

/**
 * Create status-based icon with color coding
 */
export const createStatusIcon = (
  iconType: keyof typeof iconPaths,
  status: 'operational' | 'maintenance' | 'offline' | 'unknown' = 'operational',
  size: 'small' | 'medium' | 'large' = 'medium'
): L.DivIcon => {
  const baseColor = infrastructureColors[iconType];
  const statusColor = infrastructureColors[status];
  
  // Use base color for operational, status color for others
  const color = status === 'operational' ? baseColor : statusColor;
  const pulse = status === 'maintenance';
  
  return createSVGIcon(iconType, color, size, pulse);
};

/**
 * Predefined icons for different infrastructure types
 * Using representative colors and SVG icons
 */
export const icons = {
  station: createSVGIcon('station', infrastructureColors.station, 'medium'),
  terminal: createSVGIcon('terminal', infrastructureColors.terminal, 'medium'),
  hydrocarbonField: createSVGIcon('hydrocarbonField', infrastructureColors.hydrocarbonField, 'medium'),
  pipeline: infrastructureColors.pipeline // Color for polylines
};

/**
 * Create icon based on operational status
 */
export const getIconByStatus = (
  type: 'station' | 'terminal' | 'hydrocarbonField',
  statusCode?: string
): L.DivIcon => {
  let status: 'operational' | 'maintenance' | 'offline' | 'unknown' = 'unknown';
  
  if (statusCode) {
    const code = statusCode.toUpperCase();
    if (code.includes('OPERATIONAL') || code.includes('ACTIVE')) {
      status = 'operational';
    } else if (code.includes('MAINTENANCE') || code.includes('REPAIR')) {
      status = 'maintenance';
    } else if (code.includes('OFFLINE') || code.includes('INACTIVE') || code.includes('CLOSED')) {
      status = 'offline';
    }
  }
  
  return createStatusIcon(type, status, 'medium');
};
