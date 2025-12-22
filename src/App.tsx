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
import theme from './theme'
import { Layout } from './shared/components/Layout'
import { Dashboard } from './shared/components/Dashboard'
import { Login } from './modules/system/auth/pages'
import { UserList, UserEdit } from './modules/system/security/pages'

function App() {
  // TODO: Get from auth context
  const isAuthenticated = false;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* All routes go through Layout */}
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route path="login" element={<Login />} />
            
            {/* Root redirect */}
            <Route index element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />

            {/* Protected Routes */}
            <Route path="dashboard" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            } />
            
            {/* Security Module */}
            <Route path="security">
              <Route path="users" element={
                isAuthenticated ? <UserList /> : <Navigate to="/login" replace />
              } />
              <Route path="users/create" element={
                isAuthenticated ? <UserEdit /> : <Navigate to="/login" replace />
              } />
              <Route path="users/:userId/edit" element={
                isAuthenticated ? <UserEdit /> : <Navigate to="/login" replace />
              } />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
