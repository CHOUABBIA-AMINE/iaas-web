import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import authService from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required')
      return
    }

    setError('')
    setLoading(true)

    try {
      console.log('Sending login request to:', 'http://localhost:8080/raas/api')
      console.log('Credentials:', { username, password })

      const response = await authService.login({ 
        username: username.trim(), 
        password: password.trim() 
      })

      console.log('Login response:', response)

      // Store auth data
      authService.storeAuthData(response.token, response.user)

      // Redirect to home page
      navigate('/', { replace: true })
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials and try again.')
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: '#2e7d32',
              borderRadius: 2,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: 28,
              mb: 2,
            }}
          >
            R
          </Box>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Login to RAAS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Public Procurement Management System
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoFocus
            disabled={loading}
            autoComplete="username"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            autoComplete="current-password"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              <strong>Backend URL:</strong>
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              {'http://localhost:8080/raas/api'}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              <strong>Endpoint:</strong> POST /auth/login
            </Typography>
          </Alert>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage
