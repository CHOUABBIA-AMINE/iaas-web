import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Grid,
  Autocomplete,
  Chip,
} from '@mui/material'
import { Save, Cancel } from '@mui/icons-material'
import userService from '../../services/userService'
import roleService from '../../services/roleService'
import groupService from '../../services/groupService'
import { UserDTO, RoleDTO, GroupDTO } from '../../types/security'

function UserEdit() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const isEditMode = Boolean(userId)

  const [user, setUser] = useState<UserDTO>({
    username: '',
    email: '',
    password: '',
    enabled: true,
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    roles: [],
    groups: [],
  })

  const [availableRoles, setAvailableRoles] = useState<RoleDTO[]>([])
  const [availableGroups, setAvailableGroups] = useState<GroupDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch available roles and groups
        const [rolesData, groupsData] = await Promise.all([
          roleService.getAll(),
          groupService.getAll(),
        ])
        setAvailableRoles(rolesData)
        setAvailableGroups(groupsData)

        // Fetch user data if editing
        if (isEditMode && userId) {
          const userData = await userService.getById(parseInt(userId))
          setUser(userData)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, isEditMode])

  const handleInputChange = (field: keyof UserDTO, value: any) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    // Validation
    if (!user.username || !user.email) {
      setError('Username and email are required')
      return
    }

    if (!isEditMode && !user.password) {
      setError('Password is required for new users')
      return
    }

    setSaving(true)
    try {
      if (isEditMode && userId) {
        // Update existing user
        await userService.update(parseInt(userId), user)
        setSuccess('User updated successfully')
      } else {
        // Create new user
        await userService.create(user)
        setSuccess('User created successfully')
      }

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/security/users')
      }, 1500)
    } catch (err) {
      console.error('Error saving user:', err)
      setError(err instanceof Error ? err.message : 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/security/users')
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, pt: 12 }}>
      <Card>
        <CardHeader
          title={isEditMode ? 'Edit User' : 'Create New User'}
          subheader={isEditMode ? `User ID: ${userId}` : 'Fill in the details to create a new user'}
        />
        <CardContent>
          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Form */}
          <Grid container spacing={3}>
            {/* Username */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={user.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                disabled={isEditMode} // Username cannot be changed
                helperText={isEditMode ? 'Username cannot be modified' : ''}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={user.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>

            {/* Password (only for create or if changing) */}
            {!isEditMode && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={user.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required={!isEditMode}
                  helperText={isEditMode ? 'Leave empty to keep current password' : ''}
                />
              </Grid>
            )}

            {/* Roles */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={availableRoles}
                getOptionLabel={(option) => option.name}
                value={user.roles || []}
                onChange={(_, newValue) => handleInputChange('roles', newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Roles" placeholder="Select roles" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      label={option.name}
                      size="small"
                      sx={{ bgcolor: '#e3f2fd' }}
                    />
                  ))
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Grid>

            {/* Groups */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={availableGroups}
                getOptionLabel={(option) => option.name}
                value={user.groups || []}
                onChange={(_, newValue) => handleInputChange('groups', newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Groups" placeholder="Select groups" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      label={option.name}
                      size="small"
                      sx={{ bgcolor: '#f3e5f5' }}
                    />
                  ))
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Grid>

            {/* Account Status Switches */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.enabled}
                      onChange={(e) => handleInputChange('enabled', e.target.checked)}
                      color="success"
                    />
                  }
                  label="Enabled"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.accountNonLocked !== false}
                      onChange={(e) => handleInputChange('accountNonLocked', e.target.checked)}
                      color="success"
                    />
                  }
                  label="Account Non-Locked"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.accountNonExpired !== false}
                      onChange={(e) => handleInputChange('accountNonExpired', e.target.checked)}
                      color="success"
                    />
                  }
                  label="Account Non-Expired"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.credentialsNonExpired !== false}
                      onChange={(e) =>
                        handleInputChange('credentialsNonExpired', e.target.checked)
                      }
                      color="success"
                    />
                  }
                  label="Credentials Non-Expired"
                />
              </Box>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    bgcolor: '#2e7d32',
                    '&:hover': { bgcolor: '#1b5e20' },
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserEdit
