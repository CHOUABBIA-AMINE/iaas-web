/**
 * User Edit/Create Page
 * Form for creating new users or editing existing ones
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Card, CardHeader, CardContent, TextField, Button,
  FormControlLabel, Switch, Alert, CircularProgress,
  Grid, Autocomplete, Chip,
} from '@mui/material'
import { Save, Cancel } from '@mui/icons-material'
import { userService, roleService, groupService } from '../services'
import { UserDTO, RoleDTO, GroupDTO, createEmptyUser } from '../dto'

function UserEdit() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const isEditMode = Boolean(userId)

  const [user, setUser] = useState<UserDTO>(createEmptyUser())
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
        const [rolesData, groupsData] = await Promise.all([
          roleService.getAll(),
          groupService.getAll(),
        ])
        setAvailableRoles(rolesData)
        setAvailableGroups(groupsData)

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
    setUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

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
        await userService.update(parseInt(userId), user)
        setSuccess('User updated successfully')
      } else {
        await userService.create(user)
        setSuccess('User created successfully')
      }

      setTimeout(() => navigate('/security/users'), 1500)
    } catch (err) {
      console.error('Error saving user:', err)
      setError(err instanceof Error ? err.message : 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
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
          {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Username" value={user.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required disabled={isEditMode}
                helperText={isEditMode ? 'Username cannot be modified' : ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" type="email" value={user.email}
                onChange={(e) => handleInputChange('email', e.target.value)} required
              />
            </Grid>

            {!isEditMode && (
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Password" type="password" value={user.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)} required
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Autocomplete multiple options={availableRoles}
                getOptionLabel={(option) => option.name}
                value={user.roles || []}
                onChange={(_, newValue) => handleInputChange('roles', newValue)}
                renderInput={(params) => <TextField {...params} label="Roles" placeholder="Select roles" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} label={option.name} size="small" sx={{ bgcolor: '#e3f2fd' }} />
                  ))
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete multiple options={availableGroups}
                getOptionLabel={(option) => option.name}
                value={user.groups || []}
                onChange={(_, newValue) => handleInputChange('groups', newValue)}
                renderInput={(params) => <TextField {...params} label="Groups" placeholder="Select groups" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} label={option.name} size="small" sx={{ bgcolor: '#f3e5f5' }} />
                  ))
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={<Switch checked={user.enabled} onChange={(e) => handleInputChange('enabled', e.target.checked)} color="success" />}
                  label="Enabled"
                />
                <FormControlLabel
                  control={<Switch checked={user.accountNonLocked !== false} onChange={(e) => handleInputChange('accountNonLocked', e.target.checked)} color="success" />}
                  label="Account Non-Locked"
                />
                <FormControlLabel
                  control={<Switch checked={user.accountNonExpired !== false} onChange={(e) => handleInputChange('accountNonExpired', e.target.checked)} color="success" />}
                  label="Account Non-Expired"
                />
                <FormControlLabel
                  control={<Switch checked={user.credentialsNonExpired !== false} onChange={(e) => handleInputChange('credentialsNonExpired', e.target.checked)} color="success" />}
                  label="Credentials Non-Expired"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" startIcon={<Cancel />} onClick={() => navigate('/security/users')} disabled={saving}>
                  Cancel
                </Button>
                <Button variant="contained" startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleSave} disabled={saving}
                  sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
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
