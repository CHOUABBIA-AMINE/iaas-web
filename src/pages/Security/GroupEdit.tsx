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
import groupService, { GroupDTO } from '../../services/groupService'
import roleService, { RoleDTO } from '../../services/roleService'

function GroupEdit() {
  const navigate = useNavigate()
  const { groupId } = useParams<{ groupId: string }>()
  const isEditMode = Boolean(groupId)

  const [group, setGroup] = useState<GroupDTO>({
    name: '',
    description: '',
    roles: [],
  })

  const [availableRoles, setAvailableRoles] = useState<RoleDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch available roles
        const rolesData = await roleService.getAll()
        console.log('Available roles:', rolesData)
        setAvailableRoles(rolesData)

        // Fetch group data if editing
        if (isEditMode && groupId) {
          const groupData = await groupService.getById(parseInt(groupId))
          console.log('Group data from backend:', groupData)
          
          // Match group's roles with available roles by ID
          let matchedRoles: RoleDTO[] = []
          
          if (groupData.roles && groupData.roles.length > 0) {
            matchedRoles = groupData.roles
              .map(groupRole => rolesData.find(role => role.id === groupRole.id))
              .filter((role): role is RoleDTO => role !== undefined)
            console.log('Matched roles:', matchedRoles)
          }
          
          setGroup({
            ...groupData,
            roles: matchedRoles,
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
  }, [groupId, isEditMode])

  const handleInputChange = (field: keyof GroupDTO, value: any) => {
    setGroup((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    // Validation
    if (!group.name) {
      setError('Group name is required')
      return
    }

    if (group.name.length < 2 || group.name.length > 50) {
      setError('Group name must be between 2 and 50 characters')
      return
    }

    setSaving(true)
    try {
      console.log('Saving group:', group)

      if (isEditMode && groupId) {
        // Update existing group
        const updatedGroup = await groupService.update(parseInt(groupId), group)
        console.log('Group updated:', updatedGroup)
        setSuccess('Group updated successfully')
      } else {
        // Create new group
        const createdGroup = await groupService.create(group)
        console.log('Group created:', createdGroup)
        setSuccess('Group created successfully')
      }

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/security/groups')
      }, 1500)
    } catch (err) {
      console.error('Error saving group:', err)
      setError(err instanceof Error ? err.message : 'Failed to save group')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/security/groups')
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
          title={isEditMode ? 'Edit Group' : 'Create New Group'}
          subheader={
            isEditMode 
              ? `Editing group: ${group.name} (ID: ${groupId})`
              : 'Fill in the details to create a new group'
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
                label="Group Name"
                value={group.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                helperText="Enter a unique group name (2-50 characters)"
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
                value={group.description || ''}
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

            {/* Roles */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={availableRoles}
                getOptionLabel={(option) => option.name}
                value={group.roles || []}
                onChange={(_, newValue) => {
                  console.log('Roles changed:', newValue)
                  handleInputChange('roles', newValue)
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Roles" 
                    placeholder="Select roles"
                    helperText={`${group.roles?.length || 0} role(s) selected`}
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

export default GroupEdit
