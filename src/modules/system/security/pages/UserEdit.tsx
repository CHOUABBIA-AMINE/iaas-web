/**
 * User Edit/Create Page
 * Form to create or edit users with i18n support
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { userService } from '../services';
import { UserDTO } from '../dto';

const UserEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isEditMode = !!userId;

  const [user, setUser] = useState<Partial<UserDTO>>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getById(Number(userId));
      setUser(data);
      setError('');
    } catch (err: any) {
      console.error('Failed to load user:', err);
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setUser({
      ...user,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      if (isEditMode) {
        await userService.update(Number(userId), user as UserDTO);
      } else {
        await userService.create(user as UserDTO);
      }

      navigate('/security/users');
    } catch (err: any) {
      console.error('Failed to save user:', err);
      setError(err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/security/users');
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
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        {isEditMode ? t('user.editUser') : t('user.createUser')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('user.username')}
                  value={user.username || ''}
                  onChange={handleChange('username')}
                  required
                  disabled={isEditMode}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('user.email')}
                  type="email"
                  value={user.email || ''}
                  onChange={handleChange('email')}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('user.firstName')}
                  value={user.firstName || ''}
                  onChange={handleChange('firstName')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('user.lastName')}
                  value={user.lastName || ''}
                  onChange={handleChange('lastName')}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.enabled || false}
                      onChange={handleChange('enabled')}
                    />
                  }
                  label={t('user.enabled')}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={saving}
                  >
                    {saving ? t('common.loading') : t('common.save')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserEdit;
