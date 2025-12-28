/**
 * Room Edit/Create Page - Professional Version
 * Comprehensive form with cascading Bloc/Floor selectors
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 * @updated 12-28-2025
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
import roomService from '../services/RoomService';
import blocService from '../services/BlocService';
import floorService from '../services/FloorService';
import { RoomDTO, BlocDTO, FloorDTO } from '../dto';

const RoomEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const isEditMode = !!roomId;

  // Form state
  const [room, setRoom] = useState<Partial<RoomDTO>>({
    code: '',
    designationFr: '',
    designationEn: '',
    designationAr: '',
  });

  // Related entities
  const [blocs, setBlocs] = useState<BlocDTO[]>([]);
  const [floors, setFloors] = useState<FloorDTO[]>([]);
  const [selectedBloc, setSelectedBloc] = useState<BlocDTO | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<FloorDTO | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRelatedData();
    if (isEditMode) {
      loadRoomData();
    }
  }, [roomId]);

  const loadRelatedData = async () => {
    try {
      const [blocsData, floorsData] = await Promise.all([
        blocService.getAll(),
        floorService.getAll(),
      ]);
      
      setBlocs(Array.isArray(blocsData) ? blocsData : []);
      setFloors(Array.isArray(floorsData) ? floorsData : []);
    } catch (err: any) {
      console.error('Failed to load related data:', err);
      setError(err.message || 'Failed to load data');
    }
  };

  const loadRoomData = async () => {
    try {
      setLoading(true);
      const roomData = await roomService.getById(Number(roomId));
      setRoom(roomData);
      
      if (roomData.bloc) {
        setSelectedBloc(roomData.bloc);
      }
      if (roomData.floor) {
        setSelectedFloor(roomData.floor);
      }
      
      setError('');
    } catch (err: any) {
      console.error('Failed to load room:', err);
      setError(err.message || 'Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Code validation
    if (!room.code || room.code.trim().length < 2) {
      errors.code = 'Code must be at least 2 characters';
    }

    // French designation validation (required)
    if (!room.designationFr || room.designationFr.trim().length < 2) {
      errors.designationFr = 'French designation must be at least 2 characters';
    }

    // Bloc validation
    if (!selectedBloc) {
      errors.bloc = 'Bloc is required';
    }

    // Floor validation
    if (!selectedFloor) {
      errors.floor = 'Floor is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof RoomDTO) => (e: any) => {
    const value = e.target.value;
    setRoom({ ...room, [field]: value });
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handleBlocChange = (event: any, newValue: BlocDTO | null) => {
    setSelectedBloc(newValue);
    if (validationErrors.bloc) {
      setValidationErrors({ ...validationErrors, bloc: '' });
    }
  };

  const handleFloorChange = (event: any, newValue: FloorDTO | null) => {
    setSelectedFloor(newValue);
    if (validationErrors.floor) {
      setValidationErrors({ ...validationErrors, floor: '' });
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

      const roomData: RoomDTO = {
        code: room.code!,
        designationFr: room.designationFr!,
        designationEn: room.designationEn,
        designationAr: room.designationAr,
        blocId: selectedBloc!.id,
        floorId: selectedFloor!.id,
      };

      if (isEditMode) {
        await roomService.update(Number(roomId), roomData);
      } else {
        await roomService.create(roomData);
      }

      navigate('/environment/rooms');
    } catch (err: any) {
      console.error('Failed to save room:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/environment/rooms');
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
          {isEditMode ? (t('room.edit') || 'Edit Room') : (t('room.create') || 'Create Room')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditMode ? 'Update room information and location' : 'Create a new room in a bloc and floor'}
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
                    label={t('room.code') || 'Code'}
                    value={room.code || ''}
                    onChange={handleChange('code')}
                    required
                    error={!!validationErrors.code}
                    helperText={validationErrors.code || 'Required - Unique room code'}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t('room.designationFr') || 'French Designation'}
                    value={room.designationFr || ''}
                    onChange={handleChange('designationFr')}
                    required
                    error={!!validationErrors.designationFr}
                    helperText={validationErrors.designationFr || 'Required'}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t('room.designationEn') || 'English Designation'}
                    value={room.designationEn || ''}
                    onChange={handleChange('designationEn')}
                    helperText="Optional"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t('room.designationAr') || 'Arabic Designation'}
                    value={room.designationAr || ''}
                    onChange={handleChange('designationAr')}
                    helperText="Optional"
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
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={selectedBloc}
                    onChange={handleBlocChange}
                    options={blocs}
                    getOptionLabel={(option) => option.designationFr || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('room.bloc') || 'Bloc'}
                        required
                        error={!!validationErrors.bloc}
                        helperText={validationErrors.bloc || 'Required - Select the building bloc'}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={selectedFloor}
                    onChange={handleFloorChange}
                    options={floors}
                    getOptionLabel={(option) => option.designationFr || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('room.floor') || 'Floor'}
                        required
                        error={!!validationErrors.floor}
                        helperText={validationErrors.floor || 'Required - Select the floor'}
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

export default RoomEdit;
