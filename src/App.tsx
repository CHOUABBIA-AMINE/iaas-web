import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme/theme'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { UserList, UserEdit, RoleList, RoleEdit } from './pages/Security'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Security Routes - Users */}
            <Route path="/security/users" element={<UserList />} />
            <Route path="/security/users/create" element={<UserEdit />} />
            <Route path="/security/users/:userId/edit" element={<UserEdit />} />
            
            {/* Security Routes - Roles */}
            <Route path="/security/roles" element={<RoleList />} />
            <Route path="/security/roles/create" element={<RoleEdit />} />
            <Route path="/security/roles/:roleId/edit" element={<RoleEdit />} />
            
            {/* Common Routes */}
            <Route path="/common/structure" element={<div>Structure Page (TODO)</div>} />
            <Route path="/common/job" element={<div>Job Page (TODO)</div>} />
            <Route path="/common/person" element={<div>Person Page (TODO)</div>} />
            <Route path="/common/employee" element={<div>Employee Page (TODO)</div>} />
            <Route path="/common/archivebox" element={<div>Archive Box Page (TODO)</div>} />
            <Route path="/common/folder" element={<div>Folder Page (TODO)</div>} />
            <Route path="/common/document" element={<div>Document Page (TODO)</div>} />
            <Route path="/common/mail" element={<div>Mail Page (TODO)</div>} />
            
            {/* Business Routes */}
            <Route path="/business/provider" element={<div>Provider Page (TODO)</div>} />
            <Route path="/business/representator" element={<div>Provider Representator Page (TODO)</div>} />
            <Route path="/business/clearance" element={<div>Clearance Page (TODO)</div>} />
            <Route path="/business/exclusion" element={<div>Provider Exclusion Page (TODO)</div>} />
            <Route path="/business/financial" element={<div>Financial Operation Page (TODO)</div>} />
            <Route path="/business/budget" element={<div>Budget Modification Page (TODO)</div>} />
            <Route path="/business/planned" element={<div>Planned Item Page (TODO)</div>} />
            <Route path="/business/distribution" element={<div>Item Distribution Page (TODO)</div>} />
            <Route path="/business/consultation" element={<div>Consultation Page (TODO)</div>} />
            <Route path="/business/submission" element={<div>Submission Page (TODO)</div>} />
            <Route path="/business/contract" element={<div>Contract Page (TODO)</div>} />
            <Route path="/business/contractitem" element={<div>Contract Item Page (TODO)</div>} />
            <Route path="/business/amendment" element={<div>Amendment Page (TODO)</div>} />
            
            {/* User Profile Routes */}
            <Route path="/profile" element={<div>Profile Page (TODO)</div>} />
            <Route path="/language" element={<div>Language Settings Page (TODO)</div>} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
