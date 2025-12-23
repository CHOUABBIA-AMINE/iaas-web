/**
 * HydrocarbonField Edit/Create Page - Professional Version
 * Comprehensive form for creating and editing hydrocarbon fields
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
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
import { hydrocarbonFieldService } from '../services';
import { vendorService, operationalStatusService } from '../../common/services';
import { hydrocarbonFieldTypeService } from '../../type/services';
import { HydrocarbonFieldDTO, HydrocarbonFieldCreateDTO } from '../dto';
import { getLocalizedName, sortByLocalizedName } from '../utils/localizationUtils';

const HydrocarbonFieldEdit = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { fieldId } = useParams<{ fieldId: string }>();
  const isEditMode = !!fieldId;

  // Get current language
  const currentLanguage = i18n.language || 'en';

  // Form state
  const [field, setField] = useState<Partial<HydrocarbonFieldDTO>>({
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
    hydrocarbonFieldTypeId: 0,
    vendorId: 0,
    localityId: 0,
  });

  // Available options
  const [operationalStatuses, setOperationalStatuses] = useState<any[]>([]);
  const [fieldTypes, setFieldTypes] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [fieldId]);

  // Sort options by localized name
  const sortedFieldTypes = useMemo(
    () => sortByLocalizedName(fieldTypes, currentLanguage),
    [fieldTypes, currentLanguage]
  );

  const sortedOperationalStatuses = useMemo(
    () => sortByLocalizedName(operationalStatuses, currentLanguage),
    [operationalStatuses, currentLanguage]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load real data from APIs in parallel
      const [
        vendorsData,
        fieldTypesData,
        operationalStatusesData
      ] = await Promise.allSettled([
        vendorService.getAll(),
        hydrocarbonFieldTypeService.getAll(),
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

      // Handle field types
      if (fieldTypesData.status === 'fulfilled') {
        const types = Array.isArray(fieldTypesData.value) 
          ? fieldTypesData.value 
          : (fieldTypesData.value?.data || fieldTypesData.value?.content || []);
        setFieldTypes(types);
      } else {
        console.error('Failed to load field types:', fieldTypesData.reason);
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
      
      // TODO: Load from real API when available
      // For now, using mock data for localities
      setLocalities([
        { id: 1, name: 'Hassi Messaoud' },
        { id: 2, name: 'In Amenas' },
        { id: 3, name: 'Hassi R\'Mel' },
        { id: 4, name: 'Ouargla' },
        { id: 5, name: 'Berkine Basin' },
        { id: 6, name: 'Illizi Basin' },
      ]);

      // Load field if editing
      if (isEditMode) {
        const fieldData = await hydrocarbonFieldService.getById(Number(fieldId));
        setField(fieldData);
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

    if (!field.name || field.name.trim().length < 2) {
      errors.name = 'Field name must be at least 2 characters';
    }

    if (!field.code || field.code.trim().length < 2) {
      errors.code = 'Field code is required';
    }

    if (!field.placeName || field.placeName.trim().length < 2) {
      errors.placeName = 'Place name is required';
    }

    if (!field.latitude || field.latitude === 0) {
      errors.latitude = 'Latitude is required';
    }

    if (!field.longitude || field.longitude === 0) {
      errors.longitude = 'Longitude is required';
    }

    if (!field.operationalStatusId) {
      errors.operationalStatusId = 'Operational status is required';
    }

    if (!field.hydrocarbonFieldTypeId) {
      errors.hydrocarbonFieldTypeId = 'Field type is required';
    }

    if (!field.vendorId) {
      errors.vendorId = 'Vendor is required';
    }

    if (!field.localityId) {
      errors.localityId = 'Locality is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (fieldName: keyof HydrocarbonFieldDTO) => (e: any) => {
    const value = e.target.value;
    setField({ ...field, [fieldName]: value });
    
    // Clear validation error for this field
    if (validationErrors[fieldName]) {
      setValidationErrors({ ...validationErrors, [fieldName]: '' });
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

      const fieldData: HydrocarbonFieldCreateDTO = {
        name: field.name!,
        code: field.code!,
        placeName: field.placeName!,
        latitude: Number(field.latitude),
        longitude: Number(field.longitude),
        elevation: field.elevation ? Number(field.elevation) : undefined,
        installationDate: field.installationDate,
        commissioningDate: field.commissioningDate,
        decommissioningDate: field.decommissioningDate,
        operationalStatusId: Number(field.operationalStatusId),
        hydrocarbonFieldTypeId: Number(field.hydrocarbonFieldTypeId),
        vendorId: Number(field.vendorId),
        localityId: Number(field.localityId),
      };

      if (isEditMode) {
        await hydrocarbonFieldService.update(Number(fieldId), { id: Number(fieldId), ...fieldData });
      } else {
        await hydrocarbonFieldService.create(fieldData);
      }

      navigate('/network/core/hydrocarbon-fields');
    } catch (err: any) {
      console.error('Failed to save field:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save hydrocarbon field');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/network/core/hydrocarbon-fields');
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
          {isEditMode ? 'Edit Hydrocarbon Field' : 'Create Hydrocarbon Field'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode ? 'Update field information and details' : 'Create a new hydrocarbon field'}
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
                    label="Field Name"
                    value={field.name || ''}
                    onChange={handleChange('name')}
                    required
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Field Code"
                    value={field.code || ''}
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
                    value={field.placeName || ''}
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
                    value={field.localityId || ''}
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
                    value={field.latitude || ''}
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
                    value={field.longitude || ''}
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
                    value={field.elevation || ''}
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
                    label="Field Type"
                    value={field.hydrocarbonFieldTypeId || ''}
                    onChange={handleChange('hydrocarbonFieldTypeId')}
                    required
                    error={!!validationErrors.hydrocarbonFieldTypeId}
                    helperText={validationErrors.hydrocarbonFieldTypeId}
                  >
                    {sortedFieldTypes.length > 0 ? (
                      sortedFieldTypes.map((type) => (
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
                    value={field.operationalStatusId || ''}
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
                    value={field.vendorId || ''}
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

          {/* Important Dates */}
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
                    value={field.installationDate || ''}
                    onChange={handleChange('installationDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Commissioning Date"
                    type="date"
                    value={field.commissioningDate || ''}
                    onChange={handleChange('commissioningDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Decommissioning Date"
                    type="date"
                    value={field.decommissioningDate || ''}
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

export default HydrocarbonFieldEdit;
