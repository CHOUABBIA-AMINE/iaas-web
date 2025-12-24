/**
 * Main Application Component
 * Handles routing, authentication, and i18n with RTL support
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 * @updated 12-24-2025
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
import { UserList, UserEdit, RoleList, RoleEdit, GroupList, GroupEdit } from './modules/system/security/pages';
import { 
  StationList, 
  StationEdit, 
  TerminalList, 
  TerminalEdit,
  HydrocarbonFieldList,
  HydrocarbonFieldEdit,
  PipelineList,
  PipelineEdit
} from './modules/network/core/pages';

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
          <Router>
            <Routes>
              {/* Public Routes - Outside Layout */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Protected Routes - Inside Layout */}
              <Route path="/" element={<Layout />}>
                {/* Root redirect */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard */}
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
                  {/* Users */}
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

                  {/* Roles */}
                  <Route
                    path="roles"
                    element={
                      <ProtectedRoute>
                        <RoleList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="roles/create"
                    element={
                      <ProtectedRoute>
                        <RoleEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="roles/:roleId/edit"
                    element={
                      <ProtectedRoute>
                        <RoleEdit />
                      </ProtectedRoute>
                    }
                  />

                  {/* Groups */}
                  <Route
                    path="groups"
                    element={
                      <ProtectedRoute>
                        <GroupList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="groups/create"
                    element={
                      <ProtectedRoute>
                        <GroupEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="groups/:groupId/edit"
                    element={
                      <ProtectedRoute>
                        <GroupEdit />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Network Module - Protected */}
                <Route path="network/core">
                  {/* Stations */}
                  <Route
                    path="stations"
                    element={
                      <ProtectedRoute>
                        <StationList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="stations/create"
                    element={
                      <ProtectedRoute>
                        <StationEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="stations/:stationId/edit"
                    element={
                      <ProtectedRoute>
                        <StationEdit />
                      </ProtectedRoute>
                    }
                  />

                  {/* Terminals */}
                  <Route
                    path="terminals"
                    element={
                      <ProtectedRoute>
                        <TerminalList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="terminals/create"
                    element={
                      <ProtectedRoute>
                        <TerminalEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="terminals/:terminalId/edit"
                    element={
                      <ProtectedRoute>
                        <TerminalEdit />
                      </ProtectedRoute>
                    }
                  />

                  {/* Hydrocarbon Fields */}
                  <Route
                    path="hydrocarbon-fields"
                    element={
                      <ProtectedRoute>
                        <HydrocarbonFieldList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="hydrocarbon-fields/create"
                    element={
                      <ProtectedRoute>
                        <HydrocarbonFieldEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="hydrocarbon-fields/:fieldId/edit"
                    element={
                      <ProtectedRoute>
                        <HydrocarbonFieldEdit />
                      </ProtectedRoute>
                    }
                  />

                  {/* Pipelines */}
                  <Route
                    path="pipelines"
                    element={
                      <ProtectedRoute>
                        <PipelineList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="pipelines/create"
                    element={
                      <ProtectedRoute>
                        <PipelineEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="pipelines/:pipelineId/edit"
                    element={
                      <ProtectedRoute>
                        <PipelineEdit />
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

                {/* 404 - Not Found */}
                <Route
                  path="*"
                  element={
                    <div style={{ padding: 24 }}>
                      <h1>404 - Page Not Found</h1>
                      <p>The page you're looking for doesn't exist.</p>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
