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
    return null;
  }

  // Calculate map center based on all infrastructure
  const allCoordinates = [
    ...data.stations.map(toLatLng),
    ...data.terminals.map(toLatLng),
    ...data.hydrocarbonFields.map(toLatLng)
  ];
  const center = calculateCenter(allCoordinates);

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

        {filters.showStations && <StationMarkers stations={data.stations} />}
        {filters.showTerminals && <TerminalMarkers terminals={data.terminals} />}
        {filters.showHydrocarbonFields && (
          <HydrocarbonFieldMarkers hydrocarbonFields={data.hydrocarbonFields} />
        )}
      </MapContainer>

      <MapControls filters={filters} onToggleFilter={toggleFilter} />
    </Box>
  );
};
