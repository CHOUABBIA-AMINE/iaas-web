/**
 * ArchiveBox Edit/Create Page - Professional Version
 * Comprehensive form for creating and editing archive boxes
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 */

import { useState, useEffect } from 'react';
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
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { archiveBoxService, shelfService, shelfFloorService } from '../services';
import { ArchiveBoxDTO, ShelfDTO, ShelfFloorDTO } from '../dto';

const ArchiveBoxEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { boxId } = useParams<{ boxId: string }>();
  const isEditMode = !!boxId;

  // Form state
  const [archiveBox, setArchiveBox] = useState<Partial<ArchiveBoxDTO>>({
    code: '',
    description: '',
  });

  // Available options
  const [availableShelves, setAvailableShelves] = useState<ShelfDTO[]>([]);
  const [availableShelfFloors, setAvailableShelfFloors] = useState<ShelfFloorDTO[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<ShelfDTO | null>(null);
  const [selectedShelfFloor, setSelectedShelfFloor] = useState<ShelfFloorDTO | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [boxId]);

  useEffect(() => {
    // Load shelf floors when shelf changes
    if (selectedShelf?.id) {
      loadShelfFloors(selectedShelf.id);
    } else {
      setAvailableShelfFloors([]);
      setSelectedShelfFloor(null);
    }
  }, [selectedShelf]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load shelves
      const shelvesData = await shelfService.getAll().catch(() => []);
      const shelves = Array.isArray(shelvesData) ? shelvesData : (shelvesData?.data || shelvesData?.content || []);
      setAvailableShelves(shelves);

      // Load archive box if editing
      if (isEditMode) {
        const boxData = await archiveBoxService.getById(Number(boxId));
        setArchiveBox(boxData);
        
        // Set selected shelf and shelf floor
        if (boxData.shelf) {
          setSelectedShelf(boxData.shelf);
        } else if (boxData.shelfId) {
          const shelf = shelves.find(s => s.id === boxData.shelfId);
          if (shelf) setSelectedShelf(shelf);
        }
        
        if (boxData.shelfFloor) {
          setSelectedShelfFloor(boxData.shelfFloor);
        }
      }

      setError('');
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadShelfFloors = async (shelfId: number) => {
    try {
      const floorsData = await shelfFloorService.getByShelf(shelfId).catch(() => []);
      const floors = Array.isArray(floorsData) ? floorsData : (floorsData?.data || floorsData?.content || []);
      setAvailableShelfFloors(floors);
    } catch (err: any) {
      console.error('Failed to load shelf floors:', err);
      setAvailableShelfFloors([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Code validation
    if (!archiveBox.code || archiveBox.code.trim().length < 2) {
      errors.code = 'Code must be at least 2 characters';
    }

    // Shelf validation
    if (!selectedShelf) {
      errors.shelf = 'Shelf is required';
    }

    // Shelf floor validation
    if (!selectedShelfFloor) {
      errors.shelfFloor = 'Shelf floor is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof ArchiveBoxDTO) => (e: any) => {
    const value = e.target.value;
    setArchiveBox({ ...archiveBox, [field]: value });
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handleShelfChange = (_event: any, newValue: ShelfDTO | null) => {
    setSelectedShelf(newValue);
    setSelectedShelfFloor(null); // Reset shelf floor when shelf changes
    
    // Clear validation error
    if (validationErrors.shelf) {
      setValidationErrors({ ...validationErrors, shelf: '' });
    }
  };

  const handleShelfFloorChange = (_event: any, newValue: ShelfFloorDTO | null) => {
    setSelectedShelfFloor(newValue);
    
    // Clear validation error
    if (validationErrors.shelfFloor) {
      setValidationErrors({ ...validationErrors, shelfFloor: '' });
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

      const boxData: ArchiveBoxDTO = {
        ...archiveBox,
        code: archiveBox.code!,
        shelfId: selectedShelf?.id,
        shelfFloorId: selectedShelfFloor?.id,
      };

      if (isEditMode) {
        await archiveBoxService.update(Number(boxId), boxData);
      } else {
        await archiveBoxService.create(boxData);
      }

      navigate('/environment/archive-boxes');
    } catch (err: any) {
      console.error('Failed to save archive box:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save archive box');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/environment/archive-boxes');
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
          {isEditMode ? (t('archiveBox.edit') || 'Edit Archive Box') : (t('archiveBox.create') || 'Create Archive Box')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode ? 'Update archive box information and location' : 'Create a new archive box'}
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
                    label={t('archiveBox.code') || 'Code'}
                    value={archiveBox.code || ''}
                    onChange={handleChange('code')}
                    required
                    error={!!validationErrors.code}
                    helperText={validationErrors.code || 'Unique identifier for the archive box'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('archiveBox.description') || 'Description'}
                    value={archiveBox.description || ''}
                    onChange={handleChange('description')}
                    multiline
                    rows={3}
                    helperText="Optional description of box contents"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Location */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Location
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={availableShelves}
                    getOptionLabel={(option) => option.designationLt || option.code}
                    value={selectedShelf}
                    onChange={handleShelfChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('archiveBox.shelf') || 'Shelf'}
                        required
                        error={!!validationErrors.shelf}
                        helperText={validationErrors.shelf || 'Select the shelf where the box is located'}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={availableShelfFloors}
                    getOptionLabel={(option) => option.designationLt || option.code}
                    value={selectedShelfFloor}
                    onChange={handleShelfFloorChange}
                    disabled={!selectedShelf}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('archiveBox.shelfFloor') || 'Shelf Floor'}
                        required
                        error={!!validationErrors.shelfFloor}
                        helperText={
                          validationErrors.shelfFloor || 
                          (selectedShelf ? 'Select the floor level on the shelf' : 'Select a shelf first')
                        }
                      />
                    )}
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

export default ArchiveBoxEdit;
