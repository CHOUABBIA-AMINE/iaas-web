/**
 * Main Application Component
 * Handles routing and authentication with JWT
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './shared/context/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import PublicRoute from './shared/components/PublicRoute';
import { Layout } from './shared/components/Layout';
import { Dashboard } from './shared/components/Dashboard';
import { Login } from './modules/system/auth/pages';
import { UserList, UserEdit } from './modules/system/security/pages';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* All routes go through Layout */}
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route
                path="login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Root redirect */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Protected Routes */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Security Module - Protected */}
              <Route path="security">
                <Route
                  path="users"
                  element={
                    <ProtectedRoute requiredRoles={['ADMIN', 'USER_MANAGER']}>
                      <UserList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users/create"
                  element={
                    <ProtectedRoute requiredRoles={['ADMIN', 'USER_MANAGER']}>
                      <UserEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users/:userId/edit"
                  element={
                    <ProtectedRoute requiredRoles={['ADMIN', 'USER_MANAGER']}>
                      <UserEdit />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Unauthorized page */}
              <Route
                path="unauthorized"
                element={
                  <div style={{ padding: 24 }}>
                    <h1>403 - Unauthorized</h1>
                    <p>You don't have permission to access this resource.</p>
                  </div>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
