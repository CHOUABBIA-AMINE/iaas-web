/**
 * Icon Factory
 * Factory functions for creating custom Leaflet marker icons
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
 * Infrastructure and Status Colors
 * Centralized color scheme for consistency across the application
 */
export const infrastructureColors = {
  // Infrastructure Types
  station: '#2196F3',           // Blue
  terminal: '#4CAF50',          // Green
  hydrocarbonField: '#FF9800',  // Orange
  pipeline: '#9C27B0',          // Purple
  
  // Operational Status
  operational: '#4CAF50',       // Green
  maintenance: '#FF9800',       // Orange
  offline: '#F44336',           // Red
  unknown: '#9E9E9E'            // Gray
};

/**
 * Create custom colored marker icon
 */
export const createColoredIcon = (color: string): L.DivIcon => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
};

/**
 * Predefined icons for different infrastructure types
 */
export const icons = {
  station: createColoredIcon(infrastructureColors.station),
  terminal: createColoredIcon(infrastructureColors.terminal),
  hydrocarbonField: createColoredIcon(infrastructureColors.hydrocarbonField),
  pipeline: infrastructureColors.pipeline // Color for polylines
};
