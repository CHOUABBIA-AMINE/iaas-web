/**
 * Network Map Page
 * Main page component for infrastructure geovisualization
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-25-2025
 */

import { Box, Container, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MapView } from '../components';

export const NetworkMapPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth={false} sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t('map.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('map.description')}
          </Typography>
        </Box>

        <Box sx={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
          <MapView />
        </Box>
      </Paper>
    </Container>
  );
};
