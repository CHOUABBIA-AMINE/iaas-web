/**
 * Map Controls Component
 * Provides collapsible layer visibility controls and legend
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-25-2025
 */

import { useState } from 'react';
import {
  Box,
  Paper,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import { useTranslation } from 'react-i18next';
import { MapFilters } from '../types';

interface MapControlsProps {
  filters: MapFilters;
  onToggleFilter: (filterKey: keyof MapFilters) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ filters, onToggleFilter }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start'
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Layers Icon Button - Visible only when collapsed */}
      {!isExpanded && (
        <Paper
          elevation={3}
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            bgcolor: 'white'
          }}
        >
          <Tooltip title={t('map.layers')} placement="left">
            <IconButton size="small" sx={{ color: 'primary.main' }}>
              <LayersIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      )}

      {/* Expandable Panel */}
      <Fade in={isExpanded} timeout={300}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            minWidth: 220,
            maxWidth: 300,
            borderRadius: '4px',
            display: isExpanded ? 'block' : 'none'
          }}
        >
          <Typography 
            variant="subtitle2" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              mb: 1.5
            }}
          >
            {t('map.layers')}
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Stack spacing={1.5}>
            {/* Stations - Blue #2196F3 */}
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showStations}
                  onChange={() => onToggleFilter('showStations')}
                  size="small"
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: '#2196F3',
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('map.showStations')}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
            
            {/* Terminals - Green #4CAF50 */}
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showTerminals}
                  onChange={() => onToggleFilter('showTerminals')}
                  size="small"
                  color="success"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: '#4CAF50',
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('map.showTerminals')}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
            
            {/* Hydrocarbon Fields - Orange #FF9800 */}
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showHydrocarbonFields}
                  onChange={() => onToggleFilter('showHydrocarbonFields')}
                  size="small"
                  color="warning"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: '#FF9800',
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('map.showHydrocarbonFields')}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
            
            {/* Pipelines - Purple #9C27B0 */}
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showPipelines}
                  onChange={() => onToggleFilter('showPipelines')}
                  size="small"
                  color="secondary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 3,
                      bgcolor: '#9C27B0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      borderRadius: '2px'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('map.showPipelines')}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </Stack>

          {/* Legend Footer */}
          <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {t('map.hoverToExpand')} • {t('map.clickToToggle')}
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};
