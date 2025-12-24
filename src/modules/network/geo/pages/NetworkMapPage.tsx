/**
 * Network Map Page
 * Main page component for infrastructure geovisualization
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { Box, Container, Typography, Paper } from '@mui/material';
import { MapView } from '../components';
import { useTranslation } from 'react-i18next';

export const NetworkMapPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth={false} sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Infrastructure Map
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Interactive map showing stations, terminals, hydrocarbon fields, and pipelines
          </Typography>
        </Box>

        <Box sx={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
          <MapView />
        </Box>
      </Paper>
    </Container>
  );
};
