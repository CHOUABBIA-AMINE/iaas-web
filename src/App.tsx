/**
 * Main Application Component
 * Handles routing, authentication, and i18n with RTL support
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 * @updated 12-23-2025
 */

import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import getTheme from './theme';
import { AuthProvider } from './shared/context/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import PublicRoute from './shared/components/PublicRoute';
import { Layout } from './shared/components/Layout';
import { Dashboard } from './shared/components/Dashboard';
import { Profile } from './shared/pages';
import { Login } from './modules/system/auth/pages';
import { UserList, UserEdit } from './modules/system/security/pages';

function App() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // Update document direction
  useEffect(() => {
    document.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRtl]);

  // Create emotion cache for RTL support
  const cacheRtl = useMemo(
    () =>
      createCache({
        key: isRtl ? 'muirtl' : 'muiltr',
        stylisPlugins: isRtl ? [prefixer, rtlPlugin] : [prefixer],
      }),
    [isRtl]
  );

  // Create theme with RTL support
  const theme = useMemo(() => getTheme(isRtl ? 'rtl' : 'ltr'), [isRtl]);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
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

                {/* Profile */}
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Security Module - Protected */}
                <Route path="security">
                  {/* Users - Accessible to all authenticated users */}
                  <Route
                    path="users"
                    element={
                      <ProtectedRoute>
                        <UserList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="users/create"
                    element={
                      <ProtectedRoute>
                        <UserEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="users/:userId/edit"
                    element={
                      <ProtectedRoute>
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
    </CacheProvider>
  );
}

export default App;
