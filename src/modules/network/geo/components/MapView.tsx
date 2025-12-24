/**
 * Map View Component
 * Main map container with Leaflet integration
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { MapContainer, TileLayer } from 'react-leaflet';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useMapData, useMapFilters } from '../hooks';
import { StationMarkers } from './StationMarkers';
import { TerminalMarkers } from './TerminalMarkers';
import { HydrocarbonFieldMarkers } from './HydrocarbonFieldMarkers';
import { MapControls } from './MapControls';
import { calculateCenter, toLatLng } from '../utils';
import 'leaflet/dist/leaflet.css';

export const MapView: React.FC = () => {
  const { data, loading, error } = useMapData();
  const { filters, toggleFilter } = useMapFilters();

  // Debug logging
  console.log('MapView - Loading:', loading);
  console.log('MapView - Error:', error);
  console.log('MapView - Data:', data);
  console.log('MapView - Filters:', filters);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '500px'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load map data: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No data available
        </Alert>
      </Box>
    );
  }

  // Check if we have any data with coordinates
  const hasStations = data.stations && data.stations.length > 0;
  const hasTerminals = data.terminals && data.terminals.length > 0;
  const hasFields = data.hydrocarbonFields && data.hydrocarbonFields.length > 0;
  
  console.log('Has Stations:', hasStations, 'Count:', data.stations?.length || 0);
  console.log('Has Terminals:', hasTerminals, 'Count:', data.terminals?.length || 0);
  console.log('Has Fields:', hasFields, 'Count:', data.hydrocarbonFields?.length || 0);

  if (!hasStations && !hasTerminals && !hasFields) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No infrastructure data found. Please add stations, terminals, or hydrocarbon fields with valid coordinates.
        </Alert>
      </Box>
    );
  }

  // Calculate map center based on all infrastructure
  const allCoordinates = [
    ...(data.stations || []).filter(s => s.latitude && s.longitude).map(toLatLng),
    ...(data.terminals || []).filter(t => t.latitude && t.longitude).map(toLatLng),
    ...(data.hydrocarbonFields || []).filter(f => f.latitude && f.longitude).map(toLatLng)
  ];
  
  console.log('Total coordinates:', allCoordinates.length);
  
  const center = calculateCenter(allCoordinates);
  console.log('Map center:', center);

  return (
    <Box sx={{ position: 'relative', height: '100%', minHeight: '600px' }}>
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filters.showStations && hasStations && (
          <StationMarkers stations={data.stations} />
        )}
        {filters.showTerminals && hasTerminals && (
          <TerminalMarkers terminals={data.terminals} />
        )}
        {filters.showHydrocarbonFields && hasFields && (
          <HydrocarbonFieldMarkers hydrocarbonFields={data.hydrocarbonFields} />
        )}
      </MapContainer>

      <MapControls filters={filters} onToggleFilter={toggleFilter} />
      
      {/* Debug info */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          zIndex: 1000,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          p: 1,
          borderRadius: 1,
          fontSize: '0.75rem'
        }}
      >
        Stations: {data.stations?.length || 0} | 
        Terminals: {data.terminals?.length || 0} | 
        Fields: {data.hydrocarbonFields?.length || 0}
      </Box>
    </Box>
  );
};
