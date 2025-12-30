/**
 * Employee Edit/Create Page
 * Form for creating and editing employee records
 * 
 * @author CHOUABBIA Amine
 * @created 12-30-2025
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
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { employeeService, jobService, structureService, militaryRankService, countryService } from '../services';
import { EmployeeDTO, JobDTO, StructureDTO, MilitaryRankDTO, CountryDTO } from '../dto';

const EmployeeEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState<EmployeeDTO>({
    lastNameAr: '',
    firstNameAr: '',
    lastNameLt: '',
    firstNameLt: '',
    birthDate: '',
    birthPlace: '',
    registrationNumber: '',
    countryId: undefined,
    jobId: undefined,
    structureId: undefined,
    militaryRankId: undefined,
  });

  // Lookup data
  const [jobs, setJobs] = useState<JobDTO[]>([]);
  const [structures, setStructures] = useState<StructureDTO[]>([]);
  const [militaryRanks, setMilitaryRanks] = useState<MilitaryRankDTO[]>([]);
  const [countries, setCountries] = useState<CountryDTO[]>([]);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadLookupData();
    if (isEditMode) {
      loadEmployee();
    }
  }, [id]);

  const loadLookupData = async () => {
    try {
      const [jobsData, structuresData, ranksData, countriesData] = await Promise.all([
        jobService.getAllList(),
        structureService.getAllList(),
        militaryRankService.getAllList(),
        countryService.getAllList(),
      ]);
      setJobs(jobsData);
      setStructures(structuresData);
      setMilitaryRanks(ranksData);
      setCountries(countriesData);
    } catch (err) {
      console.error('Error loading lookup data:', err);
      setError('Failed to load form data');
    }
  };

  const loadEmployee = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await employeeService.getById(Number(id));
      setFormData(data);
    } catch (err) {
      console.error('Error loading employee:', err);
      setError('Failed to load employee');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastNameAr?.trim()) {
      newErrors.lastNameAr = 'Arabic last name is required';
    }
    if (!formData.firstNameAr?.trim()) {
      newErrors.firstNameAr = 'Arabic first name is required';
    }
    if (!formData.lastNameLt?.trim()) {
      newErrors.lastNameLt = 'Latin last name is required';
    }
    if (!formData.firstNameLt?.trim()) {
      newErrors.firstNameLt = 'Latin first name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEditMode && id) {
        await employeeService.update(Number(id), formData);
      } else {
        await employeeService.create(formData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/common/administration/employee');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving employee:', err);
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof EmployeeDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1">
              {isEditMode
                ? t('employees.edit', 'Edit Employee')
                : t('employees.create', 'Create Employee')}
            </Typography>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/common/administration/employee')}
            >
              {t('common.back', 'Back')}
            </Button>
          </Stack>

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t('employees.saveSuccess', 'Employee saved successfully')}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Arabic Names */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.lastNameAr', 'Last Name (Arabic)')}
                  value={formData.lastNameAr}
                  onChange={(e) => handleChange('lastNameAr', e.target.value)}
                  error={Boolean(errors.lastNameAr)}
                  helperText={errors.lastNameAr}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.firstNameAr', 'First Name (Arabic)')}
                  value={formData.firstNameAr}
                  onChange={(e) => handleChange('firstNameAr', e.target.value)}
                  error={Boolean(errors.firstNameAr)}
                  helperText={errors.firstNameAr}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              {/* Latin Names */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.lastNameLt', 'Last Name (Latin)')}
                  value={formData.lastNameLt}
                  onChange={(e) => handleChange('lastNameLt', e.target.value)}
                  error={Boolean(errors.lastNameLt)}
                  helperText={errors.lastNameLt}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.firstNameLt', 'First Name (Latin)')}
                  value={formData.firstNameLt}
                  onChange={(e) => handleChange('firstNameLt', e.target.value)}
                  error={Boolean(errors.firstNameLt)}
                  helperText={errors.firstNameLt}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              {/* Birth Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('employees.birthDate', 'Birth Date')}
                  value={formatDateForInput(formData.birthDate)}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('employees.birthPlace', 'Birth Place')}
                  value={formData.birthPlace || ''}
                  onChange={(e) => handleChange('birthPlace', e.target.value)}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('employees.country', 'Country')}</InputLabel>
                  <Select
                    value={formData.countryId || ''}
                    onChange={(e) => handleChange('countryId', e.target.value || undefined)}
                    label={t('employees.country', 'Country')}
                  >
                    <MenuItem value="">
                      <em>{t('common.none', 'None')}</em>
                    </MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.nameLt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Registration Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('employees.registrationNumber', 'Registration Number')}
                  value={formData.registrationNumber || ''}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>

              {/* Job */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('employees.job', 'Job')}</InputLabel>
                  <Select
                    value={formData.jobId || ''}
                    onChange={(e) => handleChange('jobId', e.target.value || undefined)}
                    label={t('employees.job', 'Job')}
                  >
                    <MenuItem value="">
                      <em>{t('common.none', 'None')}</em>
                    </MenuItem>
                    {jobs.map((job) => (
                      <MenuItem key={job.id} value={job.id}>
                        {job.nameLt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Structure */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('employees.structure', 'Structure')}</InputLabel>
                  <Select
                    value={formData.structureId || ''}
                    onChange={(e) => handleChange('structureId', e.target.value || undefined)}
                    label={t('employees.structure', 'Structure')}
                  >
                    <MenuItem value="">
                      <em>{t('common.none', 'None')}</em>
                    </MenuItem>
                    {structures.map((structure) => (
                      <MenuItem key={structure.id} value={structure.id}>
                        {structure.nameLt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Military Rank */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('employees.militaryRank', 'Military Rank')}</InputLabel>
                  <Select
                    value={formData.militaryRankId || ''}
                    onChange={(e) => handleChange('militaryRankId', e.target.value || undefined)}
                    label={t('employees.militaryRank', 'Military Rank')}
                  >
                    <MenuItem value="">
                      <em>{t('common.none', 'None')}</em>
                    </MenuItem>
                    {militaryRanks.map((rank) => (
                      <MenuItem key={rank.id} value={rank.id}>
                        {rank.nameLt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
              <Button
                variant="outlined"
                onClick={() => navigate('/common/administration/employee')}
                disabled={saving}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeEdit;
