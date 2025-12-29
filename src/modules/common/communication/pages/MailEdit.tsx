/**
 * Mail Edit/Create Page
 * Form for creating and editing mail records
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 * @updated 12-29-2025 - Added Structure select field and PDF upload
 * @updated 12-29-2025 - Updated file upload endpoint to system/utility controller
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
  Paper,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { mailService, mailNatureService, mailTypeService } from '../services';
import { MailDTO, MailNatureDTO, MailTypeDTO } from '../dto';
import { structureService } from '../../administration/services';
import { StructureDTO } from '../../administration/dto';
import axiosInstance from '../../../../shared/config/axios';

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

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
  const [structures, setStructures] = useState<StructureDTO[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<MailDTO>({
    reference: '',
    recordNumber: '',
    subject: '',
    mailDate: formatDateForInput(undefined),
    recordDate: formatDateForInput(undefined),
    mailNatureId: undefined,
    mailTypeId: undefined,
    structureId: undefined,
    fileId: undefined,
  });

  useEffect(() => {
    loadLookupData();
    if (isEditMode) {
      loadMail();
    }
  }, [id]);

  const loadLookupData = async () => {
    try {
      const [naturesData, typesData, structuresData] = await Promise.all([
        mailNatureService.getAll(),
        mailTypeService.getAll(),
        structureService.getAll(),
      ]);
      setMailNatures(Array.isArray(naturesData) ? naturesData : []);
      setMailTypes(Array.isArray(typesData) ? typesData : []);
      setStructures(Array.isArray(structuresData) ? structuresData : []);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const uploadFile = async (): Promise<number | undefined> => {
    if (!selectedFile) return undefined;

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axiosInstance.post('/system/utility/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      setUploading(false);
      return response.data.id; // Assuming backend returns { id: number }
    } catch (err: any) {
      setUploading(false);
      throw new Error(err.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reference || !formData.subject || !formData.mailDate || !formData.mailNatureId || !formData.mailTypeId || !formData.structureId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Upload file first if selected
      let fileId = formData.fileId;
      if (selectedFile) {
        fileId = await uploadFile();
        if (!fileId) {
          setError('File upload failed');
          setLoading(false);
          return;
        }
      }

      const mailData = { ...formData, fileId };

      if (isEditMode) {
        await mailService.update(Number(id), mailData);
      } else {
        await mailService.create(mailData);
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

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('mail.structure') || 'Structure'}</InputLabel>
                    <Select
                      value={formData.structureId || ''}
                      label={t('mail.structure') || 'Structure'}
                      onChange={handleChange('structureId')}
                      disabled={loading}
                    >
                      {structures.map((structure) => (
                        <MenuItem key={structure.id} value={structure.id}>
                          {structure.designationFr || structure.designationEn || structure.code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* PDF Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {t('mail.attachment') || 'Mail Document (PDF)'}
                  </Typography>
                  
                  {!selectedFile ? (
                    <Paper
                      sx={{
                        p: 3,
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => document.getElementById('pdf-upload')?.click()}
                    >
                      <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        disabled={loading || uploading}
                      />
                      <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body1" fontWeight={500}>
                        Click to upload PDF file
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Maximum file size: 10MB
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'success.main',
                        borderRadius: 2,
                        bgcolor: 'success.lighter',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PdfIcon sx={{ fontSize: 40, color: 'error.main' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={500}>
                            {selectedFile.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatFileSize(selectedFile.size)}
                          </Typography>
                          {uploading && (
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress variant="determinate" value={uploadProgress} />
                              <Typography variant="caption" color="text.secondary">
                                Uploading: {uploadProgress}%
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <IconButton
                          onClick={handleRemoveFile}
                          disabled={loading || uploading}
                          color="error"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/communication/mails')} disabled={loading || uploading}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={loading || uploading}>
                  {loading || uploading ? <CircularProgress size={20} /> : (isEditMode ? t('common.update') : t('common.create'))}
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
