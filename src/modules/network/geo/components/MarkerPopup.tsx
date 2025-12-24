/**
 * Marker Popup Component
 * Displays detailed information in map marker popups
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { Box, Typography, Divider, Chip } from '@mui/material';
import { StationDTO, TerminalDTO, HydrocarbonFieldDTO } from '../../core/dto';
import { formatCoordinates } from '../utils';

interface MarkerPopupProps {
  data: StationDTO | TerminalDTO | HydrocarbonFieldDTO;
  type: 'station' | 'terminal' | 'hydrocarbonField';
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ data, type }) => {
  const getTypeLabel = () => {
    switch (type) {
      case 'station': return 'Station';
      case 'terminal': return 'Terminal';
      case 'hydrocarbonField': return 'Hydrocarbon Field';
    }
  };

  return (
    <Box sx={{ minWidth: 250, p: 1 }}>
      <Box sx={{ mb: 1 }}>
        <Chip label={getTypeLabel()} size="small" color="primary" />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        {data.name}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Code: {data.code}
      </Typography>
      
      {data.description && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {data.description}
        </Typography>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      <Typography variant="caption" display="block">
        <strong>Location:</strong> {data.placeName || 'N/A'}
      </Typography>
      
      <Typography variant="caption" display="block">
        <strong>Coordinates:</strong> {formatCoordinates(data.latitude, data.longitude)}
      </Typography>
      
      {data.elevation && (
        <Typography variant="caption" display="block">
          <strong>Elevation:</strong> {data.elevation}m
        </Typography>
      )}
      
      {'operationalStatusName' in data && data.operationalStatusName && (
        <Typography variant="caption" display="block">
          <strong>Status:</strong> {data.operationalStatusName}
        </Typography>
      )}
    </Box>
  );
};
