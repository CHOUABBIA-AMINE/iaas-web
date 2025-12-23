/**
 * Terminal Edit/Create Page - Professional Version
 * Comprehensive form for creating and editing terminals
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Divider,
  Stack,
  MenuItem,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { terminalService } from '../services';
import { vendorService, operationalStatusService } from '../../common/services';
import { terminalTypeService } from '../../type/services';
import { TerminalDTO, TerminalCreateDTO } from '../dto';
import { getLocalizedName, sortByLocalizedName } from '../utils/localizationUtils';

const TerminalEdit = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { terminalId } = useParams<{ terminalId: string }>();
  const isEditMode = !!terminalId;

  // Get current language
  const currentLanguage = i18n.language || 'en';

  // Form state
  const [terminal, setTerminal] = useState<Partial<TerminalDTO>>({
    name: '',
    code: '',
    placeName: '',
    latitude: 0,
    longitude: 0,
    elevation: undefined,
    installationDate: undefined,
    commissioningDate: undefined,
    decommissioningDate: undefined,
    operationalStatusId: 0,
    terminalTypeId: 0,
    vendorId: 0,
    localityId: 0,
  });

  // Available options
  const [operationalStatuses, setOperationalStatuses] = useState<any[]>([]);
  const [terminalTypes, setTerminalTypes] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [terminalId]);

  // Sort options by localized name
  const sortedTerminalTypes = useMemo(
    () => sortByLocalizedName(terminalTypes, currentLanguage),
    [terminalTypes, currentLanguage]
  );

  const sortedOperationalStatuses = useMemo(
    () => sortByLocalizedName(operationalStatuses, currentLanguage),
    [operationalStatuses, currentLanguage]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      
      // TODO: Load from real API when available
      // For now, using mock data for localities
      const mockLocalities = [
        { id: 1, name: 'Hassi Messaoud' },
        { id: 2, name: 'In Amenas' },
        { id: 3, name: 'Hassi R\'Mel' },
        { id: 4, name: 'Ouargla' },
        { id: 5, name: 'Arzew' },
        { id: 6, name: 'Skikda' },
      ];
      
      // Load terminal if editing
      let terminalData: TerminalDTO | null = null;
      if (isEditMode) {
        terminalData = await terminalService.getById(Number(terminalId));
        
        // If terminal has a locality from backend, add it to the list if not present
        if (terminalData.locality && terminalData.localityId) {
          const localityExists = mockLocalities.some(loc => loc.id === terminalData!.localityId);
          if (!localityExists) {
            // Add the locality from DTO to the list
            mockLocalities.push({
              id: terminalData.localityId,
              name: terminalData.locality.name || `Locality ${terminalData.localityId}`
            });
          }
        }
        
        setTerminal(terminalData);
      }
      
      setLocalities(mockLocalities);
      
      // Load real data from APIs in parallel
      const [
        vendorsData,
        terminalTypesData,
        operationalStatusesData
      ] = await Promise.allSettled([
        vendorService.getAll(),
        terminalTypeService.getAll(),
        operationalStatusService.getAll(),
      ]);

      // Handle vendors
      if (vendorsData.status === 'fulfilled') {
        const vendors = Array.isArray(vendorsData.value) 
          ? vendorsData.value 
          : (vendorsData.value?.data || vendorsData.value?.content || []);
        setVendors(vendors);
      } else {
        console.error('Failed to load vendors:', vendorsData.reason);
      }

      // Handle terminal types
      if (terminalTypesData.status === 'fulfilled') {
        const types = Array.isArray(terminalTypesData.value) 
          ? terminalTypesData.value 
          : (terminalTypesData.value?.data || terminalTypesData.value?.content || []);
        setTerminalTypes(types);
      } else {
        console.error('Failed to load terminal types:', terminalTypesData.reason);
      }

      // Handle operational statuses
      if (operationalStatusesData.status === 'fulfilled') {
        const statuses = Array.isArray(operationalStatusesData.value) 
          ? operationalStatusesData.value 
          : (operationalStatusesData.value?.data || operationalStatusesData.value?.content || []);
        setOperationalStatuses(statuses);
      } else {
        console.error('Failed to load operational statuses:', operationalStatusesData.reason);
      }

      setError('');
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!terminal.name || terminal.name.trim().length < 2) {
      errors.name = 'Terminal name must be at least 2 characters';
    }

    if (!terminal.code || terminal.code.trim().length < 2) {
      errors.code = 'Terminal code is required';
    }

    if (!terminal.placeName || terminal.placeName.trim().length < 2) {
      errors.placeName = 'Place name is required';
    }

    if (!terminal.latitude || terminal.latitude === 0) {
      errors.latitude = 'Latitude is required';
    }

    if (!terminal.longitude || terminal.longitude === 0) {
      errors.longitude = 'Longitude is required';
    }

    if (!terminal.operationalStatusId) {
      errors.operationalStatusId = 'Operational status is required';
    }

    if (!terminal.terminalTypeId) {
      errors.terminalTypeId = 'Terminal type is required';
    }

    if (!terminal.vendorId) {
      errors.vendorId = 'Vendor is required';
    }

    if (!terminal.localityId) {
      errors.localityId = 'Locality is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof TerminalDTO) => (e: any) => {
    const value = e.target.value;
    setTerminal({ ...terminal, [field]: value });
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const terminalData: TerminalCreateDTO = {
        name: terminal.name!,
        code: terminal.code!,
        placeName: terminal.placeName!,
        latitude: Number(terminal.latitude),
        longitude: Number(terminal.longitude),
        elevation: terminal.elevation ? Number(terminal.elevation) : undefined,
        installationDate: terminal.installationDate,
        commissioningDate: terminal.commissioningDate,
        decommissioningDate: terminal.decommissioningDate,
        operationalStatusId: Number(terminal.operationalStatusId),
        terminalTypeId: Number(terminal.terminalTypeId),
        vendorId: Number(terminal.vendorId),
        localityId: Number(terminal.localityId),
      };

      if (isEditMode) {
        await terminalService.update(Number(terminalId), { id: Number(terminalId), ...terminalData });
      } else {
        await terminalService.create(terminalData);
      }

      navigate('/network/core/terminals');
    } catch (err: any) {
      console.error('Failed to save terminal:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save terminal');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/network/core/terminals');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          {t('common.back')}
        </Button>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          {isEditMode ? 'Edit Terminal' : 'Create Terminal'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode ? 'Update terminal information and details' : 'Create a new pipeline terminal'}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Terminal Name"
                    value={terminal.name || ''}
                    onChange={handleChange('name')}
                    required
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Terminal Code"
                    value={terminal.code || ''}
                    onChange={handleChange('code')}
                    required
                    error={!!validationErrors.code}
                    helperText={validationErrors.code}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Location Information */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Location Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Place Name"
                    value={terminal.placeName || ''}
                    onChange={handleChange('placeName')}
                    required
                    error={!!validationErrors.placeName}
                    helperText={validationErrors.placeName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Locality"
                    value={terminal.localityId || ''}
                    onChange={handleChange('localityId')}
                    required
                    error={!!validationErrors.localityId}
                    helperText={validationErrors.localityId}
                  >
                    {localities.map((locality) => (
                      <MenuItem key={locality.id} value={locality.id}>
                        {locality.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    value={terminal.latitude || ''}
                    onChange={handleChange('latitude')}
                    required
                    error={!!validationErrors.latitude}
                    helperText={validationErrors.latitude}
                    inputProps={{ step: 0.000001 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    value={terminal.longitude || ''}
                    onChange={handleChange('longitude')}
                    required
                    error={!!validationErrors.longitude}
                    helperText={validationErrors.longitude}
                    inputProps={{ step: 0.000001 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Elevation (m)"
                    type="number"
                    value={terminal.elevation || ''}
                    onChange={handleChange('elevation')}
                    inputProps={{ step: 0.1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Technical Details */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Technical Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Terminal Type"
                    value={terminal.terminalTypeId || ''}
                    onChange={handleChange('terminalTypeId')}
                    required
                    error={!!validationErrors.terminalTypeId}
                    helperText={validationErrors.terminalTypeId}
                  >
                    {sortedTerminalTypes.length > 0 ? (
                      sortedTerminalTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {getLocalizedName(type, currentLanguage)}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Loading types...</MenuItem>
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Operational Status"
                    value={terminal.operationalStatusId || ''}
                    onChange={handleChange('operationalStatusId')}
                    required
                    error={!!validationErrors.operationalStatusId}
                    helperText={validationErrors.operationalStatusId}
                  >
                    {sortedOperationalStatuses.length > 0 ? (
                      sortedOperationalStatuses.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {getLocalizedName(status, currentLanguage)}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Loading statuses...</MenuItem>
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Vendor"
                    value={terminal.vendorId || ''}
                    onChange={handleChange('vendorId')}
                    required
                    error={!!validationErrors.vendorId}
                    helperText={validationErrors.vendorId}
                  >
                    {vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <MenuItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Loading vendors...</MenuItem>
                    )}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Dates */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Important Dates
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Installation Date"
                    type="date"
                    value={terminal.installationDate || ''}
                    onChange={handleChange('installationDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Commissioning Date"
                    type="date"
                    value={terminal.commissioningDate || ''}
                    onChange={handleChange('commissioningDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Decommissioning Date"
                    type="date"
                    value={terminal.decommissioningDate || ''}
                    onChange={handleChange('decommissioningDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Actions */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Box sx={{ p: 2.5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saving}
                size="large"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
                size="large"
                sx={{ minWidth: 150 }}
              >
                {saving ? t('common.loading') : t('common.save')}
              </Button>
            </Box>
          </Paper>
        </Stack>
      </form>
    </Box>
  );
};

export default TerminalEdit;
