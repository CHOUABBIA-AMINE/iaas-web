/**
 * Shelf Edit/Create Page - Professional Version
 * Comprehensive form with Room selector
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
import shelfService from '../services/ShelfService';
import roomService from '../services/RoomService';
import { ShelfDTO, RoomDTO } from '../dto';

const ShelfEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { shelfId } = useParams<{ shelfId: string }>();
  const isEditMode = !!shelfId;

  // Form state
  const [shelf, setShelf] = useState<Partial<ShelfDTO>>({
    code: '',
    designationFr: '',
    designationEn: '',
    designationAr: '',
  });

  // Related entities
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomDTO | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRelatedData();
    if (isEditMode) {
      loadShelfData();
    }
  }, [shelfId]);

  const loadRelatedData = async () => {
    try {
      const roomsData = await roomService.getAll();
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err: any) {
      console.error('Failed to load rooms:', err);
      setError(err.message || 'Failed to load rooms');
    }
  };

  const loadShelfData = async () => {
    try {
      setLoading(true);
      const shelfData = await shelfService.getById(Number(shelfId));
      setShelf(shelfData);
      
      if (shelfData.room) {
        setSelectedRoom(shelfData.room);
      }
      
      setError('');
    } catch (err: any) {
      console.error('Failed to load shelf:', err);
      setError(err.message || 'Failed to load shelf');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Code validation
    if (!shelf.code || shelf.code.trim().length < 2) {
      errors.code = 'Code must be at least 2 characters';
    }

    // French designation validation (required)
    if (!shelf.designationFr || shelf.designationFr.trim().length < 2) {
      errors.designationFr = 'French designation must be at least 2 characters';
    }

    // Room validation
    if (!selectedRoom) {
      errors.room = 'Room is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof ShelfDTO) => (e: any) => {
    const value = e.target.value;
    setShelf({ ...shelf, [field]: value });
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handleRoomChange = (event: any, newValue: RoomDTO | null) => {
    setSelectedRoom(newValue);
    if (validationErrors.room) {
      setValidationErrors({ ...validationErrors, room: '' });
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

      const shelfData: ShelfDTO = {
        code: shelf.code!,
        designationFr: shelf.designationFr!,
        designationEn: shelf.designationEn,
        designationAr: shelf.designationAr,
        roomId: selectedRoom!.id,
      };

      if (isEditMode) {
        await shelfService.update(Number(shelfId), shelfData);
      } else {
        await shelfService.create(shelfData);
      }

      navigate('/environment/shelves');
    } catch (err: any) {
      console.error('Failed to save shelf:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save shelf');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/environment/shelves');
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
          {isEditMode ? (t('shelf.edit') || 'Edit Shelf') : (t('shelf.create') || 'Create Shelf')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode ? 'Update shelf information and location' : 'Create a new shelf in a room'}
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
                    label={t('shelf.code') || 'Code'}
                    value={shelf.code || ''}
                    onChange={handleChange('code')}
                    required
                    error={!!validationErrors.code}
                    helperText={validationErrors.code || 'Required - Unique shelf code'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('shelf.designationFr') || 'French Designation'}
                    value={shelf.designationFr || ''}
                    onChange={handleChange('designationFr')}
                    required
                    error={!!validationErrors.designationFr}
                    helperText={validationErrors.designationFr || 'Required - Primary designation in French'}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('shelf.designationEn') || 'English Designation'}
                    value={shelf.designationEn || ''}
                    onChange={handleChange('designationEn')}
                    helperText="Optional - Designation in English"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('shelf.designationAr') || 'Arabic Designation'}
                    value={shelf.designationAr || ''}
                    onChange={handleChange('designationAr')}
                    helperText="Optional - Designation in Arabic"
                    inputProps={{
                      dir: 'rtl',
                      style: { textAlign: 'right' }
                    }}
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
                <Grid item xs={12}>
                  <Autocomplete
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    options={rooms}
                    getOptionLabel={(option) => `${option.code} - ${option.designationFr}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('shelf.room') || 'Room'}
                        required
                        error={!!validationErrors.room}
                        helperText={validationErrors.room || 'Required - Select the room where this shelf is located'}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
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

export default ShelfEdit;
