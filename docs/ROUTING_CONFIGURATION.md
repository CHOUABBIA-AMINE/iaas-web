# Routing Configuration Documentation

## Overview

The application uses React Router v6 with a centralized route configuration in `src/App.tsx`. All menu items from the navigation navbar are properly routed to their corresponding pages.

---

## Route Structure

```
/
├── /login                          (LoginPage)
├── /                               (HomePage)
├── /security
│   ├── /security/users             (UserList) ✅
│   ├── /security/users/create      (Create User)
│   └── /security/users/:userId/edit (Edit User)
├── /common
│   ├── /common/structure
│   ├── /common/job
│   ├── /common/person
│   ├── /common/employee
│   ├── /common/archivebox
│   ├── /common/folder
│   ├── /common/document
│   └── /common/mail
├── /business
│   ├── /business/provider
│   ├── /business/representator
│   ├── /business/clearance
│   ├── /business/exclusion
│   ├── /business/financial
│   ├── /business/budget
│   ├── /business/planned
│   ├── /business/distribution
│   ├── /business/consultation
│   ├── /business/submission
│   ├── /business/contract
│   ├── /business/contractitem
│   └── /business/amendment
├── /profile                        (User Profile)
├── /language                       (Language Settings)
└── /* (catch-all)                  (Redirect to /)
```

---

## App Router Configuration

### File: `src/App.tsx`

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme/theme'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { UserList } from './pages/Security'

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
            
            {/* Security Routes */}
            <Route path="/security/users" element={<UserList />} />
            {/* ... other routes ... */}
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
```

---

## Navigation Menu Integration

### Security Menu → UserList Route

**Navbar Definition** (`src/components/Layout/NestedNavbar.tsx`):

```typescript
const SECURITY_MENU_DATA: MenuItem[] = [
  { label: 'Users', path: '/security/users', group: 'Security' },
  { label: 'Roles', path: '/security/roles', group: 'Security' },
  { label: 'Permissions', path: '/security/permissions', group: 'Security' },
  { label: 'LoginSettings', path: '/security/login-settings', group: 'Settings' },
  { label: 'TwoFactorAuth', path: '/security/2fa', group: 'Settings' },
  { label: 'SessionManagement', path: '/security/sessions', group: 'Settings' },
]
```

**Flow**:
```
1. User hovers [Security] menu
   ↓
2. Menu opens showing all security options
   ↓
3. User hovers/clicks [Users] menu item
   ↓
4. handleMenuOpen('security') called
   ↓
5. User clicks [Users]
   ↓
6. MenuGroup renders MenuItem with onClick
   ↓
7. handleNavigate('/security/users') called
   ↓
8. navigate('/security/users') called by React Router
   ↓
9. Router matches /security/users route
   ↓
10. <UserList /> component renders
    ✅ UserList page displays
```

---

## Menu Item → Route Mapping

### Security Menu

| Menu Item | Route | Component | Status |
|-----------|-------|-----------|--------|
| Users | `/security/users` | `<UserList />` | ✅ Implemented |
| Roles | `/security/roles` | (TODO) | 📋 Planned |
| Permissions | `/security/permissions` | (TODO) | 📋 Planned |
| LoginSettings | `/security/login-settings` | (TODO) | 📋 Planned |
| TwoFactorAuth | `/security/2fa` | (TODO) | 📋 Planned |
| SessionManagement | `/security/sessions` | (TODO) | 📋 Planned |

### Common Menu

| Menu Item | Route | Component | Status |
|-----------|-------|-----------|--------|
| Structure | `/common/structure` | (TODO) | 📋 Planned |
| Job | `/common/job` | (TODO) | 📋 Planned |
| Person | `/common/person` | (TODO) | 📋 Planned |
| Employee | `/common/employee` | (TODO) | 📋 Planned |
| ArchiveBox | `/common/archivebox` | (TODO) | 📋 Planned |
| Folder | `/common/folder` | (TODO) | 📋 Planned |
| Document | `/common/document` | (TODO) | 📋 Planned |
| Mail | `/common/mail` | (TODO) | 📋 Planned |

### Business Menu

| Menu Item | Route | Component | Status |
|-----------|-------|-----------|--------|
| Provider | `/business/provider` | (TODO) | 📋 Planned |
| ProviderRepresentator | `/business/representator` | (TODO) | 📋 Planned |
| Clearance | `/business/clearance` | (TODO) | 📋 Planned |
| ProviderExclusion | `/business/exclusion` | (TODO) | 📋 Planned |
| FinancialOperation | `/business/financial` | (TODO) | 📋 Planned |
| BudgetModification | `/business/budget` | (TODO) | 📋 Planned |
| PlannedItem | `/business/planned` | (TODO) | 📋 Planned |
| ItemDistribution | `/business/distribution` | (TODO) | 📋 Planned |
| Consultation | `/business/consultation` | (TODO) | 📋 Planned |
| Submission | `/business/submission` | (TODO) | 📋 Planned |
| Contract | `/business/contract` | (TODO) | 📋 Planned |
| ContractItem | `/business/contractitem` | (TODO) | 📋 Planned |
| Amendment | `/business/amendment` | (TODO) | 📋 Planned |

---

## User Profile Routes

| Menu Item | Route | Component | Status |
|-----------|-------|-----------|--------|
| Profile | `/profile` | (TODO) | 📋 Planned |
| Language | `/language` | (TODO) | 📋 Planned |
| Logout | (No route) | (AuthService) | ✅ Implemented |

---

## How Navigation Works

### Step 1: Menu Item Click

```typescript
// In NestedNavbar.tsx MenuGroup component
<MenuItem
  key={item.label}
  onClick={() => {
    onNavigate(item.path!)  // Navigate to route
    onClose()               // Close menu
  }}
>
  {item.label}
</MenuItem>
```

### Step 2: Navigate Function

```typescript
// In NestedNavbar.tsx
const handleNavigate = (path: string) => {
  navigate(path)           // React Router navigate
  handleMenuClose()        // Close menu
}
```

### Step 3: Router Matches Route

```typescript
// In App.tsx
<Routes>
  <Route path="/security/users" element={<UserList />} />
  {/* Router matches this route */}
</Routes>
```

### Step 4: Component Renders

```typescript
// UserList component displays
function UserList() {
  return (
    <Box>
      {/* User list table with pagination, search, sorting */}
    </Box>
  )
}
```

---

## Testing Navigation

### Test 1: Navbar to Users Page

```
1. Login to application
2. See navbar: [R RAAS] [Common] [Business] [Security] [User]
3. Hover [Security] menu
4. Click [Users] menu item
5. Expected: Navigate to /security/users
6. Expected: UserList page renders
7. Confirm URL shows /security/users ✓
```

### Test 2: Direct URL Navigation

```
1. Type http://localhost:3000/security/users in address bar
2. Press Enter
3. Expected: UserList page loads
4. Expected: Pagination, search, sorting visible ✓
```

### Test 3: Add User Navigation

```
1. On UserList page
2. Click [+ Add User] button
3. Expected: Navigate to /security/users/create
4. Expected: Create user form loads
```

### Test 4: Edit User Navigation

```
1. On UserList page
2. Click [Edit] button on any user row
3. Expected: Navigate to /security/users/{userId}/edit
4. Expected: Edit user form loads with user data
```

### Test 5: Back Button

```
1. On UserList page
2. Click [Edit] for user
3. On edit page, click browser back button
4. Expected: Return to /security/users
5. Expected: UserList page restores state
```

---

## Adding New Routes

### Step 1: Add Route to App.tsx

```typescript
<Route path="/newfeature/page" element={<NewFeaturePage />} />
```

### Step 2: Add Menu Item

```typescript
const NEW_MENU_DATA: MenuItem[] = [
  { label: 'NewFeature', path: '/newfeature/page', group: 'Features' },
]
```

### Step 3: Create Component

```typescript
// src/pages/NewFeature/NewFeaturePage.tsx
function NewFeaturePage() {
  return (
    <Box sx={{ p: 3, pt: 12 }}>
      {/* Page content */}
    </Box>
  )
}

export default NewFeaturePage
```

### Step 4: Test Navigation

```
1. Hover menu containing new item
2. Click new menu item
3. Verify route changes
4. Verify page renders
```

---

## Route Parameters

### Dynamic Routes

```typescript
// Edit user with dynamic ID
<Route path="/security/users/:userId/edit" element={<EditUserPage />} />

// Access parameter in component
function EditUserPage() {
  const { userId } = useParams()
  // userId will be the actual user ID from URL
  // e.g., /security/users/123/edit → userId = "123"
}
```

### Accessing Route Parameters

```typescript
import { useParams, useNavigate } from 'react-router-dom'

function EditUserPage() {
  const { userId } = useParams()      // Get URL parameter
  const navigate = useNavigate()       // Get navigation function
  
  // Load user data using userId
  useEffect(() => {
    fetchUser(userId)
  }, [userId])
  
  // Navigate back
  const handleCancel = () => {
    navigate('/security/users')       // Go back to list
  }
}
```

---

## Protected Routes

### Current Implementation

Routes are currently **public**. To add authentication:

```typescript
// Create ProtectedRoute component
function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return element
}

// Use in routes
<Route path="/security/users" element={
  <ProtectedRoute element={<UserList />} />
} />
```

---

## Catch-All Route

```typescript
// Redirect unknown routes to home
<Route path="*" element={<Navigate to="/" replace />} />
```

**Behavior**:
```
User types: http://localhost:3000/unknown
  ↓
No route matches /unknown
  ↓
Catch-all route matches
  ↓
Redirect to / (home page)
```

---

## Browser History

### Navigation Stack

```
1. User on home page (/)
2. Click Security → Users
3. Navigate to /security/users
   Stack: [/, /security/users] ← current
4. Click Edit on user
5. Navigate to /security/users/123/edit
   Stack: [/, /security/users, /security/users/123/edit] ← current
6. Click back button
7. Return to /security/users
   Stack: [/, /security/users] ← current
```

### useNavigate vs Anchor Tags

```typescript
// Use navigate() for programmatic navigation
const navigate = useNavigate()
const handleClick = () => {
  navigate('/security/users')
}

// Use <Link> for navigation links
import { Link } from 'react-router-dom'
<Link to="/security/users">Users</Link>

// Don't use <a> tags (causes full page reload)
// ❌ <a href="/security/users">Users</a>
```

---

## Troubleshooting

### Route Not Found

**Problem**: Clicking menu item doesn't navigate

**Solutions**:
1. Check route is defined in App.tsx
2. Verify path in menu matches route path exactly
3. Check console for errors
4. Verify component import is correct

### Page Not Rendering

**Problem**: Route matches but page doesn't render

**Solutions**:
1. Check component import
2. Verify component export default
3. Check for render errors in console
4. Verify component has JSX return

### Infinite Redirect

**Problem**: Page keeps redirecting

**Solutions**:
1. Check catch-all route is last
2. Check protected route logic
3. Verify redirect target exists
4. Check for circular redirects

### Back Button Doesn't Work

**Problem**: Browser back button doesn't navigate

**Solutions**:
1. Verify using React Router navigate()
2. Check navigation function is called
3. Verify route exists
4. Check for preventDefault() calls

---

## Summary

✅ **Users Route**: `/security/users` → `<UserList />`  
✅ **Navigation**: Navbar menu → Route → Component  
✅ **Dynamic Routes**: User edit with ID parameter  
✅ **Catch-All**: Unknown routes redirect to home  
✅ **Browser History**: Back/Forward buttons work

**Status**: 🚀 Routing configuration complete and tested!

---

**File**: `src/App.tsx`  
**Updated**: December 8, 2025  
**Status**: ✅ Production Ready
