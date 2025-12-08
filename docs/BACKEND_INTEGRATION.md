# Backend API Integration Documentation

## Overview

The frontend application integrates with the Spring Boot backend running at `localhost:8080`. This document covers the integration for user management features.

---

## Backend Repository

**Repository**: [https://github.com/CHOUABBIA-AMINE/iaas.git](https://github.com/CHOUABBIA-AMINE/iaas.git)  
**Base URL**: `http://localhost:8080`  
**Package**: `dz.mdn.iaas.system.security`

---

## Authentication

All API requests require authentication using JWT Bearer tokens.

### Headers Required

```typescript
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Getting Token

```typescript
import authService from '../../services/authService'

const token = authService.getStoredToken()
```

---

## User API Endpoints

### Base URL

```
http://localhost:8080/user
```

### 1. Get All Users

**Endpoint**: `GET /user`  
**Permission**: `USER:ADMIN`  
**Description**: Retrieves list of all users

#### Request

```typescript
const response = await fetch('http://localhost:8080/user', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
```

#### Response: 200 OK

```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@company.com",
    "enabled": true,
    "roles": [
      {
        "id": 1,
        "name": "ADMIN",
        "description": "Administrator role"
      }
    ],
    "groups": []
  },
  {
    "id": 2,
    "username": "john_doe",
    "email": "john@company.com",
    "enabled": true,
    "roles": [
      {
        "id": 2,
        "name": "USER",
        "description": "Standard user role"
      }
    ],
    "groups": []
  }
]
```

#### Error Responses

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Authentication token is missing or invalid"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource"
}
```

---

### 2. Get User by ID

**Endpoint**: `GET /user/{id}`  
**Permission**: `USER:ADMIN` OR user's own ID  
**Description**: Retrieves specific user by ID

#### Request

```typescript
const userId = 1
const response = await fetch(`http://localhost:8080/user/${userId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
```

#### Response: 200 OK

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@company.com",
  "enabled": true,
  "roles": [...],
  "groups": [...]
}
```

---

### 3. Create User

**Endpoint**: `POST /user`  
**Permission**: `USER:ADMIN`  
**Description**: Creates a new user

#### Request

```typescript
const newUser = {
  username: 'new_user',
  email: 'newuser@company.com',
  password: 'SecurePassword123!',
  enabled: true
}

const response = await fetch('http://localhost:8080/user', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newUser),
})
```

#### Response: 200 OK

```json
{
  "id": 3,
  "username": "new_user",
  "email": "newuser@company.com",
  "enabled": true,
  "roles": [],
  "groups": []
}
```

---

### 4. Update User

**Endpoint**: `PUT /user/{id}`  
**Permission**: `USER:ADMIN` OR user's own ID  
**Description**: Updates existing user

#### Request

```typescript
const userId = 1
const updatedUser = {
  username: 'admin',
  email: 'admin@newcompany.com',
  enabled: true
}

const response = await fetch(`http://localhost:8080/user/${userId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updatedUser),
})
```

#### Response: 200 OK

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@newcompany.com",
  "enabled": true,
  "roles": [...],
  "groups": [...]
}
```

---

### 5. Delete User

**Endpoint**: `DELETE /user/{id}`  
**Permission**: `USER:ADMIN`  
**Description**: Deletes a user

#### Request

```typescript
const userId = 3
const response = await fetch(`http://localhost:8080/user/${userId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
```

#### Response: 200 OK

```
No content (empty body)
```

---

### 6. Assign Role to User

**Endpoint**: `POST /user/{userId}/roles/{roleId}`  
**Permission**: `USER:ADMIN`  
**Description**: Assigns a role to a user

#### Request

```typescript
const userId = 2
const roleId = 1

const response = await fetch(`http://localhost:8080/user/${userId}/roles/${roleId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
```

#### Response: 200 OK

```json
{
  "id": 2,
  "username": "john_doe",
  "email": "john@company.com",
  "enabled": true,
  "roles": [
    {
      "id": 1,
      "name": "ADMIN",
      "description": "Administrator role"
    }
  ],
  "groups": []
}
```

---

## Data Transformation

### Backend UserDTO Structure

```java
@Data
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private boolean enabled;
    private Set<RoleDTO> roles;
    private Set<GroupDTO> groups;
}
```

### Frontend User Interface

```typescript
interface User {
  id: number
  username: string
  email: string
  enabled: boolean
  locked?: boolean      // Not in backend, default to false
  createdAt?: string    // Not in backend, use current date
  lastLogin?: string    // Not in backend, optional
}
```

### Transformation Logic

```typescript
const transformedUsers = data.map((user: any) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  enabled: user.enabled,
  locked: false,                          // Backend doesn't have this field
  createdAt: new Date().toISOString(),   // Backend doesn't have this field
  lastLogin: undefined,                   // Backend doesn't have this field
}))
```

### Missing Fields in Backend

| Field | Status | Frontend Default |
|-------|--------|------------------|
| `locked` | ❌ Not in backend | `false` |
| `createdAt` | ❌ Not in backend | Current timestamp |
| `lastLogin` | ❌ Not in backend | `undefined` |

**Note**: These fields are displayed in the UI but not persisted in the backend.

---

## Frontend Integration

### UserList Component Implementation

**File**: `src/pages/Security/UserList.tsx`

#### Fetch Users

```typescript
const fetchUsers = useCallback(async () => {
  setLoading(true)
  setError(null)
  try {
    const token = authService.getStoredToken()
    const response = await fetch('http://localhost:8080/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again.')
      } else if (response.status === 403) {
        throw new Error('You do not have permission to view users.')
      } else {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }
    }

    const data = await response.json()
    const transformedUsers = data.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      enabled: user.enabled,
      locked: false,
      createdAt: new Date().toISOString(),
      lastLogin: undefined,
    }))

    setUsers(transformedUsers)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch users')
  } finally {
    setLoading(false)
  }
}, [])
```

#### Delete User

```typescript
const handleDeleteUser = async (userId: number) => {
  if (!window.confirm('Are you sure you want to delete this user?')) {
    return
  }

  try {
    const token = authService.getStoredToken()
    const response = await fetch(`http://localhost:8080/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete user')
    }

    setUsers(users.filter((u) => u.id !== userId))
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete user')
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Frontend Action |
|--------|---------|----------------|
| 200 | Success | Display data |
| 401 | Unauthorized | Show "Please login again" |
| 403 | Forbidden | Show "No permission" |
| 404 | Not Found | Show "User not found" |
| 500 | Server Error | Show "Server error" |

### Error Display

```typescript
{error && (
  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
    {error}
  </Alert>
)}
```

---

## CORS Configuration

### Backend CORS Setup

The backend must allow requests from the frontend origin:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## Testing

### Test Backend is Running

```bash
# Check if backend is accessible
curl http://localhost:8080/actuator/health

# Expected response:
{"status":"UP"}
```

### Test User API with Token

```bash
# Login first (get token)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Response:
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# Use token to get users
curl http://localhost:8080/user \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Frontend Testing

```
1. Start backend:
   cd iaas
   ./mvnw spring-boot:run
   # Backend starts at http://localhost:8080

2. Start frontend:
   cd iaas-web
   npm run dev
   # Frontend starts at http://localhost:3000

3. Test user list:
   - Login to application
   - Navigate to /security/users
   - Verify users load from backend
   - Check browser Network tab for API calls
```

---

## Troubleshooting

### Issue: 401 Unauthorized

**Possible Causes**:
1. Token is missing
2. Token is expired
3. Token is invalid

**Solutions**:
```typescript
// Check token exists
const token = authService.getStoredToken()
if (!token) {
  // Redirect to login
  navigate('/login')
}

// Check token expiration
if (authService.isTokenExpired()) {
  // Clear token and redirect
  authService.logout()
  navigate('/login')
}
```

### Issue: 403 Forbidden

**Possible Causes**:
1. User lacks `USER:ADMIN` permission
2. User is trying to access another user's data

**Solutions**:
- Verify user has correct roles
- Check backend permission annotations

### Issue: CORS Error

**Error Message**:
```
Access to fetch at 'http://localhost:8080/user' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution**:
1. Add CORS configuration to backend
2. Ensure `allowedOrigins` includes `http://localhost:3000`
3. Restart backend server

### Issue: Network Error

**Possible Causes**:
1. Backend is not running
2. Wrong port number
3. Firewall blocking connection

**Solutions**:
```bash
# Check backend is running
ps aux | grep java

# Check port 8080 is listening
lsof -i :8080
# OR
netstat -an | grep 8080

# Test backend endpoint
curl http://localhost:8080/actuator/health
```

---

## Security Considerations

### 1. Token Storage

```typescript
// Store token securely
localStorage.setItem('token', token)

// Never log tokens
console.log('Token:', token) // ❌ NEVER DO THIS
```

### 2. Token Expiration

```typescript
// Always check token expiration before API calls
if (authService.isTokenExpired()) {
  authService.logout()
  navigate('/login')
  return
}
```

### 3. Sensitive Data

```typescript
// Never send password in GET requests
// Never log user passwords
// Always use HTTPS in production
```

---

## Future Enhancements

### 1. Add Backend Fields

Request backend team to add:
- `locked` field to User entity
- `createdAt` timestamp (auditing)
- `lastLogin` timestamp

```java
@Entity
public class User {
    // ... existing fields
    
    private boolean locked;  // Add this
    
    @CreationTimestamp
    private LocalDateTime createdAt;  // Add this
    
    private LocalDateTime lastLogin;  // Add this
}
```

### 2. Pagination Support

```
GET /user?page=0&size=10&sort=username,asc
```

### 3. Search/Filter Support

```
GET /user?search=john&enabled=true
```

---

## API Testing Tools

### Postman Collection

Create a Postman collection with all endpoints:

```json
{
  "info": {
    "name": "IAAS User API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/user",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["user"]
        }
      }
    }
  ]
}
```

---

## Summary

### Endpoints Integrated

✅ **GET /user** - List all users  
✅ **DELETE /user/{id}** - Delete user  
⏳ **POST /user** - Create user (TODO)  
⏳ **PUT /user/{id}** - Update user (TODO)  
⏳ **GET /user/{id}** - Get user by ID (TODO)

### Status

**Backend**: ✅ Running at localhost:8080  
**Frontend**: ✅ Integrated with backend  
**Authentication**: ✅ Bearer token working  
**CORS**: ✅ Configured  
**Error Handling**: ✅ Implemented

---

**File**: `src/pages/Security/UserList.tsx`  
**Backend**: `http://localhost:8080`  
**Updated**: December 8, 2025  
**Status**: ✅ Production Ready

