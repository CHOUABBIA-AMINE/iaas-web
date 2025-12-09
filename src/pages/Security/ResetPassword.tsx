import { useState, useEffect } from 'react'
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
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Save, Visibility, VisibilityOff, LockReset } from '@mui/icons-material'
import axiosInstance from '../../config/axios'
import { jwtDecode } from 'jwt-decode'

interface ResetPasswordRequest {
  username: string
  newPassword: string
  confirmPassword: string
}

interface JwtPayload {
  sub: string  // username is typically in 'sub' claim
  username?: string
  [key: string]: any
}

function ResetPassword() {
  const [formData, setFormData] = useState<ResetPasswordRequest>({
    username: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // ✅ Extract username from JWT token on component mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token)
        const username = decoded.sub || decoded.username || ''
        
        setFormData((prev) => ({
          ...prev,
          username: username,
        }))
        
        console.log('Current user:', username)
      }
    } catch (err) {
      console.error('Error decoding token:', err)
      setError('Unable to get current user information')
    }
  }, [])

  const handleInputChange = (field: keyof ResetPasswordRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear messages when user types
    setError(null)
    setSuccess(null)
  }

  const validateForm = (): boolean => {
    if (!formData.username) {
      setError('Username is required')
      return false
    }

    if (!formData.newPassword) {
      setError('New password is required')
      return false
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (!formData.confirmPassword) {
      setError('Please confirm the password')
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleResetPassword = async () => {
    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // Call backend API to reset password
      await axiosInstance.post('/user/reset-password', {
        username: formData.username,
        newPassword: formData.newPassword,
      })

      setSuccess(
        `Your password has been reset successfully. You can now use your new password to login.`
      )

      // Clear password fields after 2 seconds
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          newPassword: '',
          confirmPassword: '',
        }))
        setSuccess(null)
      }, 3000)
    } catch (err: any) {
      console.error('Error resetting password:', err)
      
      if (err.response) {
        const status = err.response.status
        const message = err.response.data?.message || err.response.statusText
        
        if (status === 401) {
          setError('Unauthorized. Please login again.')
        } else if (status === 403) {
          setError('You do not have permission to reset passwords.')
        } else if (status === 404) {
          setError(`User "${formData.username}" not found.`)
        } else {
          setError(message || 'Failed to reset password')
        }
      } else if (err.request) {
        setError('No response from server. Please check if backend is running.')
      } else {
        setError(err.message || 'An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      newPassword: '',
      confirmPassword: '',
    }))
    setError(null)
    setSuccess(null)
  }

  return (
    <Box sx={{ p: 3, pt: 12 }}>
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardHeader
          avatar={
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockReset sx={{ color: '#2e7d32', fontSize: 28 }} />
            </Box>
          }
          title="Reset Your Password"
          subheader="Change your current password to a new one"
          sx={{
            '& .MuiCardHeader-title': {
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#2e7d32',
            },
          }}
        />
        <CardContent>
          {/* Info Alert */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> After resetting your password, you will need to use the new password for future logins.
            </Typography>
          </Alert>

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
            {/* Username - Disabled (read-only) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                disabled
                helperText="Your current username (cannot be changed)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f5f5f5',
                  },
                }}
              />
            </Grid>

            {/* New Password */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                required
                disabled={loading}
                placeholder="Enter new password"
                helperText="Minimum 6 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32',
                    },
                  },
                }}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                disabled={loading}
                placeholder="Re-enter new password"
                helperText="Must match new password"
                error={formData.confirmPassword !== '' && formData.newPassword !== formData.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32',
                    },
                  },
                }}
              />
            </Grid>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <Grid item xs={12}>
                <Box sx={{ mt: -1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password strength:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Box
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        bgcolor:
                          formData.newPassword.length >= 6
                            ? formData.newPassword.length >= 8
                              ? formData.newPassword.length >= 12
                                ? '#2e7d32'
                                : '#ffa726'
                              : '#ff9800'
                            : '#f44336',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formData.newPassword.length < 6 && 'Weak (minimum 6 characters)'}
                    {formData.newPassword.length >= 6 &&
                      formData.newPassword.length < 8 &&
                      'Fair'}
                    {formData.newPassword.length >= 8 &&
                      formData.newPassword.length < 12 &&
                      'Good'}
                    {formData.newPassword.length >= 12 && 'Strong'}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  disabled={loading}
                  sx={{
                    borderColor: '#999',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#666',
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : (
                      <Save />
                    )
                  }
                  onClick={handleResetPassword}
                  disabled={loading || !formData.newPassword || !formData.confirmPassword}
                  sx={{
                    bgcolor: '#2e7d32',
                    '&:hover': { bgcolor: '#1b5e20' },
                    minWidth: '140px',
                  }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ResetPassword
