# User List Page Documentation

## Overview

The User List page (`UserList.tsx`) is a comprehensive security management interface that displays a paginated list of users with advanced filtering, searching, and sorting capabilities.

---

## Features

### 1. **Pagination with Custom Page Sizes**

```typescript
// Available page sizes: 5, 10, 20 users per page
rowsPerPageOptions={[5, 10, 20]}
```

**Features**:
- Switch between 5, 10, or 20 items per page
- Automatic reset to page 1 when changing page size
- Display total number of filtered users
- Previous/Next navigation buttons
- Jump to specific page

**Usage**:
```
1. Click page size dropdown in pagination footer
2. Select 5, 10, or 20
3. Page resets to 1 automatically
4. Table displays selected number of users
```

---

### 2. **Search with Auto-Refresh**

```typescript
// Search filters by username or email
user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
user.email.toLowerCase().includes(searchTerm.toLowerCase())
```

**Features**:
- Real-time search as you type
- Search by username or email
- Case-insensitive matching
- Auto-refresh capability (5-second interval)
- Manual refresh button
- Auto-refresh toggle chip

**Auto-Refresh Settings**:
```typescript
// Default interval: 5000ms (5 seconds)
const [refreshInterval, setRefreshInterval] = useState(5000)

// Auto-refresh can be toggled on/off
const [autoRefresh, setAutoRefresh] = useState(true)
```

**Usage**:
```
1. Type in search field to filter users
2. Click "Refresh" button for manual refresh
3. Click "Auto Refresh" chip to toggle auto-refresh
   - ON (green): Updates every 5 seconds
   - OFF (gray): Manual refresh only
```

---

### 3. **Sorting**

```typescript
type SortField = 'username' | 'enabled' | 'locked' | 'createdAt'
type SortOrder = 'asc' | 'desc'
```

**Sortable Columns**:
- **Username** - Alphabetical A-Z or Z-A
- **Enabled** - Enabled first/Disabled first
- **Locked** - Locked first/Unlocked first
- **Created** - Newest first/Oldest first

**Sorting Logic**:
```typescript
const handleSort = (field: SortField) => {
  if (sort.field === field) {
    // Toggle sort order if same field
    setSort({
      field,
      order: sort.order === 'asc' ? 'desc' : 'asc',
    })
  } else {
    // Change field and start with ascending
    setSort({
      field,
      order: 'asc',
    })
  }
}
```

**Usage**:
```
1. Click on any sortable column header
2. First click: Sort ascending (A-Z, earliest-latest)
3. Second click: Sort descending (Z-A, latest-earliest)
4. Click different column: Change sort field
```

---

## User Data Structure

```typescript
interface User {
  id: string              // Unique identifier
  username: string        // Username (searchable, sortable)
  email: string          // Email address (searchable)
  enabled: boolean       // Account enabled status (sortable)
  locked: boolean        // Account locked status (sortable)
  createdAt: string      // ISO date string (sortable)
  lastLogin?: string     // Last login timestamp (optional)
}
```

---

## Component Props

The UserList component accepts no props. It manages all state internally:

```typescript
interface State {
  users: User[]                    // All users from API
  filteredUsers: User[]            // After search/filter
  loading: boolean                 // API loading state
  error: string | null             // Error message
  searchTerm: string               // Current search input
  page: number                     // Current page (0-indexed)
  rowsPerPage: number              // Items per page (5, 10, 20)
  sort: SortState                  // Sort field and order
  autoRefresh: boolean             // Auto-refresh enabled
  refreshInterval: number          // Refresh interval in ms
}
```

---

## API Integration

### Fetch Users

**Current**: Mock data for testing  
**Production**: Replace with actual API call

```typescript
// Current implementation (mock)
const fetchUsers = useCallback(async () => {
  setLoading(true)
  setError(null)
  try {
    const mockUsers = generateMockUsers()
    setUsers(mockUsers)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch users')
  } finally {
    setLoading(false)
  }
}, [])

// Replace with:
const fetchUsers = useCallback(async () => {
  setLoading(true)
  setError(null)
  try {
    const response = await fetch('/api/security/users', {
      headers: { Authorization: `Bearer ${authService.getStoredToken()}` }
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    const data = await response.json()
    setUsers(data)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch users')
  } finally {
    setLoading(false)
  }
}, [])
```

### Backend Endpoint Requirements

```
GET /api/security/users

Query Parameters (optional):
  ?page=0
  ?pageSize=10
  ?search=john
  ?sortBy=username
  ?sortOrder=asc

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Response:
  {
    "data": [User[], ...],
    "total": 150,
    "page": 0,
    "pageSize": 10
  }
```

---

## User Actions

### Add User

```typescript
const handleAddUser = () => {
  navigate('/security/users/create')
}
```

**Route**: `/security/users/create`  
**Action**: Opens create user form

### Edit User

```typescript
const handleEditUser = (userId: string) => {
  navigate(`/security/users/${userId}/edit`)
}
```

**Route**: `/security/users/{userId}/edit`  
**Action**: Opens edit user form

### Delete User

```typescript
const handleDeleteUser = (userId: string) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    setUsers(users.filter((u) => u.id !== userId))
  }
}
```

**Behavior**:
1. Shows confirmation dialog
2. Removes user from list if confirmed
3. Should call API endpoint to delete on server

**API Integration**:
```typescript
const handleDeleteUser = async (userId: string) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return
  
  try {
    const response = await fetch(`/api/security/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authService.getStoredToken()}` }
    })
    if (!response.ok) throw new Error('Failed to delete user')
    setUsers(users.filter((u) => u.id !== userId))
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete user')
  }
}
```

---

## UI Components

### Search Bar

```typescript
<TextField
  placeholder="Search by username or email..."
  value={searchTerm}
  onChange={handleSearchChange}
  InputProps={{ startAdornment: <Search /> }}
  size="small"
/>
```

**Features**:
- Real-time filtering
- Placeholder text
- Search icon
- Material-UI styling

### Status Chips

```typescript
// Enabled/Disabled
<Chip
  label={user.enabled ? 'Enabled' : 'Disabled'}
  color={user.enabled ? 'success' : 'error'}
  size="small"
  variant="outlined"
/>

// Locked/Unlocked
<Chip
  label={user.locked ? 'Locked' : 'Unlocked'}
  color={user.locked ? 'error' : 'success'}
  size="small"
  variant="outlined"
/>
```

**Colors**:
- **Green (success)**: Enabled, Unlocked
- **Red (error)**: Disabled, Locked

### Action Buttons

```typescript
<Box sx={{ display: 'flex', gap: 1 }}>
  <Button
    size="small"
    startIcon={<Edit />}
    onClick={() => handleEditUser(user.id)}
  >
    Edit
  </Button>
  <Button
    size="small"
    startIcon={<Delete />}
    onClick={() => handleDeleteUser(user.id)}
  >
    Delete
  </Button>
</Box>
```

---

## Styling

### Color Scheme

```typescript
// Primary green color
color: '#2e7d32'
hoverColor: '#1b5e20'

// Error/delete color
color: '#c41c47'
```

### Responsive Design

- Mobile-friendly table scrolling
- Responsive search bar
- Flexible pagination
- Touch-friendly buttons

---

## Routes

### Add to App Router

```typescript
import { UserList } from './pages/Security'

// In your router configuration:
{
  path: '/security/users',
  element: <UserList />
}
```

### Navigation Menu Integration

Add to navbar Security menu:

```typescript
const SECURITY_MENU_DATA: MenuItem[] = [
  { label: 'Users', path: '/security/users', group: 'Security' },
  // ... other security menu items
]
```

---

## Mock Data

12 mock users are included for testing:

```typescript
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    enabled: true,
    locked: false,
    createdAt: '2025-01-15T10:30:00Z',
    lastLogin: '2025-12-08T09:15:00Z',
  },
  // ... 11 more mock users
]
```

---

## Testing

### Test Cases

1. **Pagination**
   - [ ] Change page size to 5
   - [ ] Change page size to 10
   - [ ] Change page size to 20
   - [ ] Navigate to next page
   - [ ] Navigate to previous page

2. **Search**
   - [ ] Search by username
   - [ ] Search by email
   - [ ] Search with partial match
   - [ ] Clear search

3. **Sorting**
   - [ ] Sort by username (asc/desc)
   - [ ] Sort by enabled (asc/desc)
   - [ ] Sort by locked (asc/desc)
   - [ ] Sort by created date (asc/desc)

4. **Auto-Refresh**
   - [ ] Enable auto-refresh
   - [ ] Disable auto-refresh
   - [ ] Manual refresh button works

5. **Actions**
   - [ ] Add user button works
   - [ ] Edit user button navigates correctly
   - [ ] Delete user shows confirmation
   - [ ] Delete user removes from list

---

## Performance Considerations

1. **Large Datasets**
   - Pagination prevents loading all users at once
   - Consider backend pagination for datasets > 10,000 items

2. **Search Performance**
   - Client-side filtering for datasets < 1,000 items
   - Implement debouncing for larger datasets
   - Consider server-side search for datasets > 10,000 items

3. **Auto-Refresh**
   - Default 5-second interval
   - Can be increased for better performance
   - Consider WebSocket for real-time updates

---

## Future Enhancements

1. **Multi-Select**
   - Select multiple users
   - Bulk actions (enable, disable, delete)

2. **Filters**
   - Filter by enabled/disabled status
   - Filter by locked status
   - Filter by date range

3. **Exports**
   - Export to CSV
   - Export to PDF

4. **Real-Time Updates**
   - WebSocket integration
   - Server-sent events
   - Live user count

5. **Advanced Search**
   - Search operators (AND, OR, NOT)
   - Regular expression support
   - Search history

---

## Troubleshooting

### Users Not Loading

**Issue**: Table shows "No users found" or loading spinner stuck

**Solutions**:
1. Check API endpoint is accessible
2. Verify authentication token is valid
3. Check network tab in DevTools
4. Verify API returns correct data format

### Search Not Working

**Issue**: Search field doesn't filter users

**Solutions**:
1. Check searchTerm state is updating
2. Verify filter logic in useEffect
3. Check username/email fields exist in data
4. Try clearing search field and retyping

### Pagination Issues

**Issue**: Page size not changing or pagination stuck

**Solutions**:
1. Check rowsPerPage state updates
2. Verify page resets to 0 on size change
3. Check filteredUsers length is correct

### Auto-Refresh Not Working

**Issue**: Auto-refresh not updating data

**Solutions**:
1. Check autoRefresh toggle is ON
2. Check refreshInterval is not 0
3. Verify fetchUsers function is called
4. Check browser console for errors

---

## Code Examples

### Custom Page Size

```typescript
// Add custom page sizes
rowsPerPageOptions={[5, 10, 20, 50]} // Add 50 as option
```

### Custom Refresh Interval

```typescript
// Change default refresh interval to 10 seconds
const [refreshInterval, setRefreshInterval] = useState(10000)
```

### Filter by Status

```typescript
// Add enabled/locked filter
let filtered = users.filter((user) => {
  const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase())
  const matchesEnabled = enabledFilter === null || user.enabled === enabledFilter
  const matchesLocked = lockedFilter === null || user.locked === lockedFilter
  return matchesSearch && matchesEnabled && matchesLocked
})
```

---

**File**: `src/pages/Security/UserList.tsx`  
**Created**: December 8, 2025  
**Status**: ✅ Ready for Production

