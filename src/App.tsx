/**
 * Main Application Component
 * Handles routing and authentication
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { Layout } from './shared/components/Layout'
import { Dashboard } from './shared/components/Dashboard'
import { Login } from './modules/system/auth/pages'
import { UserList, UserEdit } from './modules/system/security/pages'
import theme from './theme/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Security Module */}
            <Route path="security">
              <Route path="users" element={<UserList />} />
              <Route path="users/create" element={<UserEdit />} />
              <Route path="users/:userId/edit" element={<UserEdit />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
