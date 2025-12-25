/**
 * Map View Component
 * Main map container with Leaflet integration
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-25-2025
 */

import { MapContainer, TileLayer } from 'react-leaflet';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMapData, useMapFilters } from '../hooks';
import { StationMarkers } from './StationMarkers';
import { TerminalMarkers } from './TerminalMarkers';
import { HydrocarbonFieldMarkers } from './HydrocarbonFieldMarkers';
import { MapControls } from './MapControls';
import { calculateCenter, toLatLng } from '../utils';
import 'leaflet/dist/leaflet.css';

export const MapView: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useMapData();
  const { filters, toggleFilter } = useMapFilters();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '500px',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          {t('map.loading')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            {t('map.error')}
          </Typography>
          <Typography variant="body2">
            {error.message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          {t('map.noData')}
        </Alert>
      </Box>
    );
  }

  // Check if we have any data with coordinates
  const hasStations = data.stations && data.stations.length > 0;
  const hasTerminals = data.terminals && data.terminals.length > 0;
  const hasFields = data.hydrocarbonFields && data.hydrocarbonFields.length > 0;

  if (!hasStations && !hasTerminals && !hasFields) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          {t('map.noData')}
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
    </Box>
  );
};
