/**
 * Pipeline System Edit/Create Page
 *
 * Based on StationEdit.tsx pattern.
 *
 * @author CHOUABBIA Amine
 * @created 01-01-2026
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack as BackIcon, Cancel as CancelIcon, Save as SaveIcon } from '@mui/icons-material';

import { pipelineSystemService } from '../services/pipelineSystemService';
import { operationalStatusService, productService, regionService } from '../../common/services';
import { PipelineSystemDTO } from '../dto/PipelineSystemDTO';
import { getLocalizedName, sortByLocalizedName } from '../utils/localizationUtils';

const PipelineSystemEdit = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pipelineSystemId } = useParams<{ pipelineSystemId: string }>();
  const isEditMode = !!pipelineSystemId;

  const currentLanguage = i18n.language || 'en';

  const [pipelineSystem, setPipelineSystem] = useState<Partial<PipelineSystemDTO>>({
    code: '',
    name: '',
    productId: 0,
    operationalStatusId: 0,
    regionId: 0,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [operationalStatuses, setOperationalStatuses] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineSystemId]);

  const sortedProducts = useMemo(() => sortByLocalizedName(products, currentLanguage), [products, currentLanguage]);
  const sortedOperationalStatuses = useMemo(
    () => sortByLocalizedName(operationalStatuses, currentLanguage),
    [operationalStatuses, currentLanguage]
  );
  const sortedRegions = useMemo(() => sortByLocalizedName(regions, currentLanguage), [regions, currentLanguage]);

  const loadData = async () => {
    try {
      setLoading(true);

      let systemData: PipelineSystemDTO | null = null;
      if (isEditMode) {
        systemData = await pipelineSystemService.getById(Number(pipelineSystemId));
      }

      const [productsData, statusesData, regionsData] = await Promise.allSettled([
        productService.getAll(),
        operationalStatusService.getAll(),
        regionService.getAll(),
      ]);

      if (productsData.status === 'fulfilled') {
        const list = Array.isArray(productsData.value)
          ? productsData.value
          : productsData.value?.data || productsData.value?.content || [];
        setProducts(list);
      }

      if (statusesData.status === 'fulfilled') {
        const list = Array.isArray(statusesData.value)
          ? statusesData.value
          : statusesData.value?.data || statusesData.value?.content || [];
        setOperationalStatuses(list);
      }

      if (regionsData.status === 'fulfilled') {
        const list = Array.isArray(regionsData.value)
          ? regionsData.value
          : regionsData.value?.data || regionsData.value?.content || [];
        setRegions(list);
      }

      if (systemData) {
        setPipelineSystem(systemData);
      }

      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!pipelineSystem.name || pipelineSystem.name.trim().length < 2) {
      errors.name = 'System name must be at least 2 characters';
    }

    if (!pipelineSystem.code || pipelineSystem.code.trim().length < 2) {
      errors.code = 'Code is required';
    }

    if (!pipelineSystem.productId) {
      errors.productId = 'Product is required';
    }

    if (!pipelineSystem.operationalStatusId) {
      errors.operationalStatusId = 'Operational status is required';
    }

    if (!pipelineSystem.regionId) {
      errors.regionId = 'Region is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof PipelineSystemDTO) => (e: any) => {
    const value = e.target.value;
    setPipelineSystem((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setError('');

      const payload: PipelineSystemDTO = {
        id: isEditMode ? Number(pipelineSystemId) : 0,
        code: String(pipelineSystem.code || ''),
        name: String(pipelineSystem.name || ''),
        productId: Number(pipelineSystem.productId),
        operationalStatusId: Number(pipelineSystem.operationalStatusId),
        regionId: Number(pipelineSystem.regionId),
      };

      if (isEditMode) {
        await pipelineSystemService.update(Number(pipelineSystemId), payload);
      } else {
        await pipelineSystemService.create(payload);
      }

      navigate('/network/core/pipeline-systems');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save pipeline system');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/network/core/pipeline-systems');
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
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={handleCancel} sx={{ mb: 2 }}>
          {t('common.back')}
        </Button>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          {isEditMode ? 'Edit Pipeline System' : 'Create Pipeline System'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode ? 'Update pipeline system information' : 'Create a new pipeline system'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
                    label="System Name"
                    value={pipelineSystem.name || ''}
                    onChange={handleChange('name')}
                    required
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Code"
                    value={pipelineSystem.code || ''}
                    onChange={handleChange('code')}
                    required
                    error={!!validationErrors.code}
                    helperText={validationErrors.code}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Classification
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Region"
                    value={pipelineSystem.regionId || ''}
                    onChange={handleChange('regionId')}
                    required
                    error={!!validationErrors.regionId}
                    helperText={validationErrors.regionId}
                  >
                    {sortedRegions.length > 0 ? (
                      sortedRegions.map((region) => (
                        <MenuItem key={region.id} value={region.id}>
                          {getLocalizedName(region, currentLanguage)}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Loading regions...</MenuItem>
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Product"
                    value={pipelineSystem.productId || ''}
                    onChange={handleChange('productId')}
                    required
                    error={!!validationErrors.productId}
                    helperText={validationErrors.productId}
                  >
                    {sortedProducts.length > 0 ? (
                      sortedProducts.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {getLocalizedName(product, currentLanguage)}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Loading products...</MenuItem>
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Operational Status"
                    value={pipelineSystem.operationalStatusId || ''}
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
              </Grid>
            </Box>
          </Paper>

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

export default PipelineSystemEdit;
