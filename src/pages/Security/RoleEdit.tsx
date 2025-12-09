import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Autocomplete,
  Chip,
} from '@mui/material'
import { Save, Cancel } from '@mui/icons-material'
import roleService, { RoleDTO } from '../../services/roleService'
import permissionService, { PermissionDTO } from '../../services/permissionService'

function RoleEdit() {
  const navigate = useNavigate()
  const { roleId } = useParams<{ roleId: string }>()
  const isEditMode = Boolean(roleId)

  const [role, setRole] = useState<RoleDTO>({
    name: '',
    description: '',
    permissions: [],
  })

  const [availablePermissions, setAvailablePermissions] = useState<PermissionDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch available permissions
        const permissionsData = await permissionService.getAll()
        console.log('Available permissions:', permissionsData)
        setAvailablePermissions(permissionsData)

        // Fetch role data if editing
        if (isEditMode && roleId) {
          const roleData = await roleService.getById(parseInt(roleId))
          console.log('Role data from backend:', roleData)
          
          // Match role's permissions with available permissions by ID
          let matchedPermissions: PermissionDTO[] = []
          
          if (roleData.permissions && roleData.permissions.length > 0) {
            matchedPermissions = roleData.permissions
              .map(rolePermission => permissionsData.find(permission => permission.id === rolePermission.id))
              .filter((permission): permission is PermissionDTO => permission !== undefined)
            console.log('Matched permissions:', matchedPermissions)
          }
          
          setRole({
            ...roleData,
            permissions: matchedPermissions,
          })
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [roleId, isEditMode])

  const handleInputChange = (field: keyof RoleDTO, value: any) => {
    setRole((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    // Validation
    if (!role.name) {
      setError('Role name is required')
      return
    }

    if (role.name.length < 2 || role.name.length > 50) {
      setError('Role name must be between 2 and 50 characters')
      return
    }

    setSaving(true)
    try {
      console.log('Saving role:', role)

      if (isEditMode && roleId) {
        // Update existing role
        const updatedRole = await roleService.update(parseInt(roleId), role)
        console.log('Role updated:', updatedRole)
        setSuccess('Role updated successfully')
      } else {
        // Create new role
        const createdRole = await roleService.create(role)
        console.log('Role created:', createdRole)
        setSuccess('Role created successfully')
      }

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/security/roles')
      }, 1500)
    } catch (err) {
      console.error('Error saving role:', err)
      setError(err instanceof Error ? err.message : 'Failed to save role')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/security/roles')
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          pt: 12,
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
          title={isEditMode ? 'Edit Role' : 'Create New Role'}
          subheader={
            isEditMode 
              ? `Editing role: ${role.name} (ID: ${roleId})`
              : 'Fill in the details to create a new role'
          }
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
            {/* Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role Name"
                value={role.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                helperText="Enter a unique role name (2-50 characters)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32',
                    },
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={role.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                helperText="Optional description (max 200 characters)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32',
                    },
                  },
                }}
              />
            </Grid>

            {/* Permissions */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={availablePermissions}
                getOptionLabel={(option) => option.name}
                value={role.permissions || []}
                onChange={(_, newValue) => {
                  console.log('Permissions changed:', newValue)
                  handleInputChange('permissions', newValue)
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Permissions" 
                    placeholder="Select permissions"
                    helperText={`${role.permissions?.length || 0} permission(s) selected`}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      size="small"
                      sx={{ bgcolor: '#e3f2fd' }}
                    />
                  ))
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2e7d32',
                    },
                  },
                }}
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={saving}
                  sx={{
                    borderColor: '#999',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#666',
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Save />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    bgcolor: '#2e7d32',
                    '&:hover': { bgcolor: '#1b5e20' },
                    minWidth: '120px',
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

export default RoleEdit
