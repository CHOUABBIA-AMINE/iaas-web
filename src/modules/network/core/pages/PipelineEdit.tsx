/**
 * Pipeline Edit/Create Page - Professional Version
 * Comprehensive form for creating and editing pipelines with all fields
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
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
import { pipelineService, pipelineSystemService } from '../services';
import { vendorService, operationalStatusService } from '../../common/services';
import { alloyService, productService } from '../../common/services';
import { PipelineDTO, PipelineCreateDTO } from '../dto/PipelineDTO';
import { getLocalizedName, sortByLocalizedName } from '../utils/localizationUtils';

interface ExtendedPipelineDTO extends PipelineDTO {
  nominalDiameter?: number;
  wallThickness?: number;
  outsideDiameter?: number;
  minimumYieldStrength?: number;
  ultimateTensileStrength?: number;
  elongation?: number;
  manufacturingStandard?: string;
  coatingType?: string;
  cathodicProtection?: string;
  flowRate?: number;
  flowVelocity?: number;
  temperature?: number;
  viscosity?: number;
}

const PipelineEdit = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pipelineId } = useParams<{ pipelineId: string }>();
  const isEditMode = !!pipelineId;

  // Get current language
  const currentLanguage = i18n.language || 'en';

  // Form state with all fields
  const [pipeline, setPipeline] = useState<Partial<ExtendedPipelineDTO>>({
    name: '',
    code: '',
    description: '',
    length: undefined,
    diameter: undefined,
    nominalDiameter: undefined,
    wallThickness: undefined,
    outsideDiameter: undefined,
    maximumOperatingPressure: undefined,
    designPressure: undefined,
    minimumYieldStrength: undefined,
    ultimateTensileStrength: undefined,
    elongation: undefined,
    manufacturingStandard: '',
    coatingType: '',
    cathodicProtection: '',
    flowRate: undefined,
    flowVelocity: undefined,
    temperature: undefined,
    viscosity: undefined,
    installationDate: undefined,
    commissioningDate: undefined,
    decommissioningDate: undefined,
    operationalStatusId: 0,
    pipelineSystemId: undefined,
    vendorId: 0,
    alloyId: undefined,
    productId: undefined,
  });

  // Available options
  const [operationalStatuses, setOperationalStatuses] = useState<any[]>([]);
  const [pipelineSystems, setPipelineSystems] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [alloys, setAlloys] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [pipelineId]);

  // Sort options by localized name
  const sortedOperationalStatuses = useMemo(
    () => sortByLocalizedName(operationalStatuses, currentLanguage),
    [operationalStatuses, currentLanguage]
  );

  const sortedProducts = useMemo(
    () => sortByLocalizedName(products, currentLanguage),
    [products, currentLanguage]
  );

  const sortedAlloys = useMemo(
    () => sortByLocalizedName(alloys, currentLanguage),
    [alloys, currentLanguage]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load pipeline first if editing
      let pipelineData: any = null;
      if (isEditMode) {
        pipelineData = await pipelineService.getById(Number(pipelineId));
      }
      
      // Load all data from REST APIs in parallel
      const [
        vendorsData,
        pipelineSystemsData,
        operationalStatusesData,
        alloysData,
        productsData
      ] = await Promise.allSettled([
        vendorService.getAll(),
        pipelineSystemService.getAll(),
        operationalStatusService.getAll(),
        alloyService.getAll(),
        productService.getAll(),
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

      // Handle pipeline systems
      if (pipelineSystemsData.status === 'fulfilled') {
        const systems = Array.isArray(pipelineSystemsData.value) 
          ? pipelineSystemsData.value 
          : (pipelineSystemsData.value?.data || pipelineSystemsData.value?.content || []);
        setPipelineSystems(systems);
      } else {
        console.error('Failed to load pipeline systems:', pipelineSystemsData.reason);
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

      // Handle alloys
      if (alloysData.status === 'fulfilled') {
        const alloys = Array.isArray(alloysData.value) 
          ? alloysData.value 
          : (alloysData.value?.data || alloysData.value?.content || []);
        setAlloys(alloys);
      } else {
        console.error('Failed to load alloys:', alloysData.reason);
      }

      // Handle products
      if (productsData.status === 'fulfilled') {
        const products = Array.isArray(productsData.value) 
          ? productsData.value 
          : (productsData.value?.data || productsData.value?.content || []);
        setProducts(products);
      } else {
        console.error('Failed to load products:', productsData.reason);
      }

      // Set pipeline data if editing
      if (pipelineData) {
        setPipeline(pipelineData);
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

    if (!pipeline.name || pipeline.name.trim().length < 2) {
      errors.name = 'Pipeline name must be at least 2 characters';
    }

    if (!pipeline.code || pipeline.code.trim().length < 2) {
      errors.code = 'Pipeline code is required';
    }

    if (!pipeline.operationalStatusId) {
      errors.operationalStatusId = 'Operational status is required';
    }

    if (!pipeline.vendorId) {
      errors.vendorId = 'Vendor is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof ExtendedPipelineDTO) => (e: any) => {
    const value = e.target.value;
    setPipeline({ ...pipeline, [field]: value });
    
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

      const pipelineData: any = {
        name: pipeline.name!,
        code: pipeline.code!,
        description: pipeline.description,
        length: pipeline.length ? Number(pipeline.length) : undefined,
        diameter: pipeline.diameter ? Number(pipeline.diameter) : undefined,
        nominalDiameter: pipeline.nominalDiameter ? Number(pipeline.nominalDiameter) : undefined,
        wallThickness: pipeline.wallThickness ? Number(pipeline.wallThickness) : undefined,
        outsideDiameter: pipeline.outsideDiameter ? Number(pipeline.outsideDiameter) : undefined,
        maximumOperatingPressure: pipeline.maximumOperatingPressure ? Number(pipeline.maximumOperatingPressure) : undefined,
        designPressure: pipeline.designPressure ? Number(pipeline.designPressure) : undefined,
        minimumYieldStrength: pipeline.minimumYieldStrength ? Number(pipeline.minimumYieldStrength) : undefined,
        ultimateTensileStrength: pipeline.ultimateTensileStrength ? Number(pipeline.ultimateTensileStrength) : undefined,
        elongation: pipeline.elongation ? Number(pipeline.elongation) : undefined,
        manufacturingStandard: pipeline.manufacturingStandard || undefined,
        coatingType: pipeline.coatingType || undefined,
        cathodicProtection: pipeline.cathodicProtection || undefined,
        flowRate: pipeline.flowRate ? Number(pipeline.flowRate) : undefined,
        flowVelocity: pipeline.flowVelocity ? Number(pipeline.flowVelocity) : undefined,
        temperature: pipeline.temperature ? Number(pipeline.temperature) : undefined,
        viscosity: pipeline.viscosity ? Number(pipeline.viscosity) : undefined,
        installationDate: pipeline.installationDate,
        commissioningDate: pipeline.commissioningDate,
        decommissioningDate: pipeline.decommissioningDate,
        operationalStatusId: Number(pipeline.operationalStatusId),
        pipelineSystemId: pipeline.pipelineSystemId ? Number(pipeline.pipelineSystemId) : undefined,
        vendorId: Number(pipeline.vendorId),
        alloyId: pipeline.alloyId ? Number(pipeline.alloyId) : undefined,
        productId: pipeline.productId ? Number(pipeline.productId) : undefined,
      };

      if (isEditMode) {
        await pipelineService.update(Number(pipelineId), { id: Number(pipelineId), ...pipelineData });
      } else {
        await pipelineService.create(pipelineData);
      }

      navigate('/network/core/pipelines');
    } catch (err: any) {
      console.error('Failed to save pipeline:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save pipeline');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/network/core/pipelines');
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
          {isEditMode ? 'Edit Pipeline' : 'Create Pipeline'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode ? 'Update pipeline information and details' : 'Create a new pipeline'}
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
                    label="Pipeline Name"
                    value={pipeline.name || ''}
                    onChange={handleChange('name')}
                    required
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pipeline Code"
                    value={pipeline.code || ''}
                    onChange={handleChange('code')}
                    required
                    error={!!validationErrors.code}
                    helperText={validationErrors.code}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={pipeline.description || ''}
                    onChange={handleChange('description')}
                    multiline
                    rows={3}
                    placeholder="Describe the pipeline"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Dimensional Specifications */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Dimensional Specifications
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Nominal Diameter (inches)"
                    type="number"
                    value={pipeline.nominalDiameter || ''}
                    onChange={handleChange('nominalDiameter')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Outside Diameter (inches)"
                    type="number"
                    value={pipeline.outsideDiameter || ''}
                    onChange={handleChange('outsideDiameter')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Wall Thickness (mm)"
                    type="number"
                    value={pipeline.wallThickness || ''}
                    onChange={handleChange('wallThickness')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Diameter (inches) - Legacy"
                    type="number"
                    value={pipeline.diameter || ''}
                    onChange={handleChange('diameter')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Length (km)"
                    type="number"
                    value={pipeline.length || ''}
                    onChange={handleChange('length')}
                    inputProps={{ step: 0.01, min: 0 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Pressure Specifications */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Pressure Specifications
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Design Pressure (bar)"
                    type="number"
                    value={pipeline.designPressure || ''}
                    onChange={handleChange('designPressure')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maximum Operating Pressure (bar)"
                    type="number"
                    value={pipeline.maximumOperatingPressure || ''}
                    onChange={handleChange('maximumOperatingPressure')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Material Properties */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Material Properties
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Alloy"
                    value={pipeline.alloyId || ''}
                    onChange={handleChange('alloyId')}
                  >
                    <MenuItem value="">None</MenuItem>
                    {sortedAlloys.map((alloy) => (
                      <MenuItem key={alloy.id} value={alloy.id}>
                        {getLocalizedName(alloy, currentLanguage)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Manufacturing Standard"
                    value={pipeline.manufacturingStandard || ''}
                    onChange={handleChange('manufacturingStandard')}
                    placeholder="e.g., API 5L, ASTM A106"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Minimum Yield Strength (MPa)"
                    type="number"
                    value={pipeline.minimumYieldStrength || ''}
                    onChange={handleChange('minimumYieldStrength')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Ultimate Tensile Strength (MPa)"
                    type="number"
                    value={pipeline.ultimateTensileStrength || ''}
                    onChange={handleChange('ultimateTensileStrength')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Elongation (%)"
                    type="number"
                    value={pipeline.elongation || ''}
                    onChange={handleChange('elongation')}
                    inputProps={{ step: 0.1, min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Protection & Coating */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Protection & Coating
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Coating Type"
                    value={pipeline.coatingType || ''}
                    onChange={handleChange('coatingType')}
                    placeholder="e.g., FBE, 3LPE, 3LPP"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cathodic Protection"
                    value={pipeline.cathodicProtection || ''}
                    onChange={handleChange('cathodicProtection')}
                    placeholder="e.g., Impressed Current, Sacrificial Anode"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Flow Characteristics */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Flow Characteristics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Product"
                    value={pipeline.productId || ''}
                    onChange={handleChange('productId')}
                  >
                    <MenuItem value="">None</MenuItem>
                    {sortedProducts.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {getLocalizedName(product, currentLanguage)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Temperature (°C)"
                    type="number"
                    value={pipeline.temperature || ''}
                    onChange={handleChange('temperature')}
                    inputProps={{ step: 0.1 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Flow Rate (m³/h)"
                    type="number"
                    value={pipeline.flowRate || ''}
                    onChange={handleChange('flowRate')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Flow Velocity (m/s)"
                    type="number"
                    value={pipeline.flowVelocity || ''}
                    onChange={handleChange('flowVelocity')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Viscosity (cP)"
                    type="number"
                    value={pipeline.viscosity || ''}
                    onChange={handleChange('viscosity')}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Operational Details */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Operational Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Operational Status"
                    value={pipeline.operationalStatusId || ''}
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
                    value={pipeline.vendorId || ''}
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

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Pipeline System"
                    value={pipeline.pipelineSystemId || ''}
                    onChange={handleChange('pipelineSystemId')}
                  >
                    <MenuItem value="">None</MenuItem>
                    {pipelineSystems.map((system) => (
                      <MenuItem key={system.id} value={system.id}>
                        {system.name}
                      </MenuItem>
                    ))}
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
                    value={pipeline.installationDate || ''}
                    onChange={handleChange('installationDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Commissioning Date"
                    type="date"
                    value={pipeline.commissioningDate || ''}
                    onChange={handleChange('commissioningDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Decommissioning Date"
                    type="date"
                    value={pipeline.decommissioningDate || ''}
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

export default PipelineEdit;
