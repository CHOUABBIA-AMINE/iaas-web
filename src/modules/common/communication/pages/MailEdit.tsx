/**
 * Mail Edit/Create Page
 * Form for creating and editing mail records
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { mailService, mailNatureService, mailTypeService } from '../services';
import { MailDTO, MailNatureDTO, MailTypeDTO } from '../dto';

// Helper function to format date as YYYY-MM-DD for input
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

const MailEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mailNatures, setMailNatures] = useState<MailNatureDTO[]>([]);
  const [mailTypes, setMailTypes] = useState<MailTypeDTO[]>([]);

  const [formData, setFormData] = useState<MailDTO>({
    reference: '',
    recordNumber: '',
    subject: '',
    mailDate: formatDateForInput(undefined),
    recordDate: formatDateForInput(undefined),
    mailNatureId: undefined,
    mailTypeId: undefined,
    structureId: 1,
    fileId: 1,
  });

  useEffect(() => {
    loadLookupData();
    if (isEditMode) {
      loadMail();
    }
  }, [id]);

  const loadLookupData = async () => {
    try {
      const [naturesData, typesData] = await Promise.all([
        mailNatureService.getAll(),
        mailTypeService.getAll(),
      ]);
      setMailNatures(Array.isArray(naturesData) ? naturesData : []);
      setMailTypes(Array.isArray(typesData) ? typesData : []);
    } catch (err: any) {
      console.error('Failed to load lookup data:', err);
      setError('Failed to load form data');
    }
  };

  const loadMail = async () => {
    try {
      setLoading(true);
      const data = await mailService.getById(Number(id));
      setFormData({
        ...data,
        mailDate: formatDateForInput(data.mailDate),
        recordDate: formatDateForInput(data.recordDate),
      });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load mail');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reference || !formData.subject || !formData.mailDate || !formData.mailNatureId || !formData.mailTypeId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await mailService.update(Number(id), formData);
      } else {
        await mailService.create(formData);
      }
      navigate('/communication/mails');
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} mail`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof MailDTO) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  if (loading && isEditMode) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/communication/mails')} variant="outlined">
          {t('common.back')}
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEditMode ? t('mail.edit') || 'Edit Mail' : t('mail.create') || 'Create Mail'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t('mail.reference') || 'Reference'}
                    value={formData.reference}
                    onChange={handleChange('reference')}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('mail.recordNumber') || 'Record Number'}
                    value={formData.recordNumber}
                    onChange={handleChange('recordNumber')}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    label={t('mail.subject') || 'Subject'}
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label={t('mail.mailDate') || 'Mail Date'}
                    value={formData.mailDate}
                    onChange={handleChange('mailDate')}
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t('mail.recordDate') || 'Record Date'}
                    value={formData.recordDate}
                    onChange={handleChange('recordDate')}
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('mail.mailNature') || 'Mail Nature'}</InputLabel>
                    <Select
                      value={formData.mailNatureId || ''}
                      label={t('mail.mailNature') || 'Mail Nature'}
                      onChange={handleChange('mailNatureId')}
                      disabled={loading}
                    >
                      {mailNatures.map((nature) => (
                        <MenuItem key={nature.id} value={nature.id}>
                          {nature.designationFr || nature.designationEn}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('mail.mailType') || 'Mail Type'}</InputLabel>
                    <Select
                      value={formData.mailTypeId || ''}
                      label={t('mail.mailType') || 'Mail Type'}
                      onChange={handleChange('mailTypeId')}
                      disabled={loading}
                    >
                      {mailTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.designationFr || type.designationEn}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/communication/mails')} disabled={loading}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : (isEditMode ? t('common.update') : t('common.create'))}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MailEdit;
