/**
 * Map Controls Component
 * Provides layer visibility controls and legend
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import {
  Box,
  Paper,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Stack
} from '@mui/material';
import { MapFilters } from '../types';
import { useTranslation } from 'react-i18next';

interface MapControlsProps {
  filters: MapFilters;
  onToggleFilter: (filterKey: keyof MapFilters) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ filters, onToggleFilter }) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        p: 2,
        minWidth: 200,
        maxWidth: 300
      }}
      elevation={3}
    >
      <Typography variant="subtitle1" gutterBottom>
        Map Layers
      </Typography>
      <Divider sx={{ mb: 1 }} />
      
      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Switch
              checked={filters.showStations}
              onChange={() => onToggleFilter('showStations')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#2196F3',
                  border: '2px solid white',
                  boxShadow: 1
                }}
              />
              <Typography variant="body2">Stations</Typography>
            </Box>
          }
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={filters.showTerminals}
              onChange={() => onToggleFilter('showTerminals')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  border: '2px solid white',
                  boxShadow: 1
                }}
              />
              <Typography variant="body2">Terminals</Typography>
            </Box>
          }
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={filters.showHydrocarbonFields}
              onChange={() => onToggleFilter('showHydrocarbonFields')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#FF9800',
                  border: '2px solid white',
                  boxShadow: 1
                }}
              />
              <Typography variant="body2">Hydrocarbon Fields</Typography>
            </Box>
          }
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={filters.showPipelines}
              onChange={() => onToggleFilter('showPipelines')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 3,
                  bgcolor: '#9C27B0',
                  boxShadow: 1
                }}
              />
              <Typography variant="body2">Pipelines</Typography>
            </Box>
          }
        />
      </Stack>
    </Paper>
  );
};
