# Refresh Token Flow - IAAS Web

**Date**: December 27, 2025  
**Strategy**: Reactive Token Refresh (On-Demand Only)

---

## 📝 Overview

The IAAS-Web application uses a **reactive token refresh strategy** where refresh tokens are used **only when necessary** - when the backend returns a `401 Unauthorized` response indicating the access token has expired.

### Why Reactive-Only?

✅ **Simpler implementation** - No background intervals or timers  
✅ **Server-driven** - Backend controls token expiration policy  
✅ **Reduced overhead** - No unnecessary token checks or refreshes  
✅ **Better error handling** - All refresh logic centralized in axios interceptors  

---

## 🔄 Complete Flow

### 1. Login Process

```
User enters credentials
        ↓
┌─────────────────────────────────────┐
│ AuthContext.login()                  │
│   ↓                                  │
│ AuthService.login(credentials)       │
│   → POST /auth/login                │
│   ← { token, refreshToken }         │
└─────────────────────────────────────┘
        ↓
Store in localStorage:
  • access_token
  • refresh_token
  • user (JSON)
        ↓
Fetch user details:
  → GET /system/security/user/username/{username}
        ↓
Update React State:
  • setToken(token)
  • setUser(userData)
        ↓
✅ User authenticated
```

---

### 2. Making API Requests (Normal Flow)

```
Component makes API call
        ↓
┌─────────────────────────────────────┐
│ Axios Request Interceptor           │
│   → Read access_token from storage  │
│   → Add header:                     │
│      Authorization: Bearer <token>   │
└─────────────────────────────────────┘
        ↓
Send to Backend
        ↓
┌─────────────────────────────────────┐
│ Backend validates token             │
└─────────────────────────────────────┘
        ↓
   ┌────┴────┐
   │ Valid?  │
   └───┬──┬──┘
       │   │
      YES  NO
       │   │
       ↓   ↓
     200  401 Unauthorized
       │   │
       ↓   └─────────────────────┐
  ✅ Success                         ↓
                        Go to Refresh Flow
```

---

### 3. Token Refresh Flow (On 401 Error)

```
Backend returns 401 Unauthorized
        ↓
┌─────────────────────────────────────────┐
│ Axios Response Interceptor                  │
│   → Detect: status === 401                  │
│   → Mark request: _retry = true             │
└─────────────────────────────────────────┘
        ↓
   ┌───────────────────────────┐
   │ Is refresh in progress?  │
   └─────────┬────────┬─────────┘
            │         │
           NO        YES
            │         │
            ↓         ↓
  Start Refresh   Queue Request
            │         (wait for token)
            ↓
┌─────────────────────────────────────────┐
│ refreshAccessToken()                     │
│   → Get refresh_token from localStorage │
│   → POST /auth/refresh                   │
│      Body: { refreshToken }                │
│   ← Response: { token, refreshToken }   │
└─────────────────────────────────────────┘
        ↓
Update localStorage:
  • access_token = new token
  • refresh_token = new refresh token
        ↓
Update Authorization header:
  Authorization: Bearer <new_token>
        ↓
Retry original request
        ↓
   ┌────────┴────────┐
   │ Refresh Success? │
   └────┬──────┬─────┘
        │       │
       YES      NO
        │       │
        ↓       ↓
  ✅ Return    ❌ Clear tokens
   response    Redirect to /login
        │
        ↓
  Notify queued requests
```

---

## 💾 Token Storage

### localStorage Structure

```javascript
localStorage = {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a8f5c9d2-4b3e-11ec-81d3-0242ac130003",
  "user": '{
    "id": 1,
    "username": "admin",
    "email": "admin@iaas.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": ["ROLE_ADMIN", "ROLE_USER"]
  }'
}
```

### When Tokens are Stored/Updated

| Event | Action |
|-------|--------|
| **Login** | Store all tokens + user |
| **Refresh** | Update access_token + refresh_token (if rotated) |
| **Logout** | Clear all tokens + user |
| **401 Error** | Automatic refresh via interceptor |

---

## ⚙️ Key Components

### 1. AuthContext (`src/shared/context/AuthContext.tsx`)

**Responsibilities:**
- Manage auth state (user, token, isAuthenticated)
- Initialize from localStorage on app load
- Provide login/logout functions
- **NO** token validation or refresh

**Key Code:**
```typescript
// Simple initialization - no token validation
useEffect(() => {
  const storedToken = authService.getToken();
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }
  
  setIsLoading(false);
}, []);
```

### 2. AuthService (`src/modules/system/auth/services/AuthService.ts`)

**Responsibilities:**
- Call backend auth APIs
- Manage token storage in localStorage
- Provide token getter methods

**Key Methods:**
```typescript
class AuthService {
  async login(credentials): Promise<LoginResult>
  async logout(): Promise<void>
  async refreshToken(): Promise<LoginResponseDTO>
  getToken(): string | null
  isAuthenticated(): boolean
}
```

### 3. Axios Interceptors (`src/shared/config/axios.ts`)

**Responsibilities:**
- Add Authorization header to all requests
- Detect 401 errors
- Automatically refresh tokens
- Queue requests during refresh
- Handle refresh failures

**Request Interceptor:**
```typescript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 🔒 Security Features

### 1. Request Queuing

**Problem:** Multiple simultaneous requests fail with 401
**Solution:** Queue all requests while one refresh is in progress

```typescript
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// If refresh in progress, queue the request
if (isRefreshing) {
  return new Promise((resolve) => {
    subscribeTokenRefresh((newToken) => {
      config.headers.Authorization = `Bearer ${newToken}`;
      resolve(axiosInstance(config));
    });
  });
}
```

### 2. Retry Protection

**Problem:** Request might retry infinitely
**Solution:** Mark request with `_retry` flag

```typescript
if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true; // Only retry once
  // ... refresh logic
}
```

### 3. Max Refresh Attempts

**Problem:** Refresh might fail repeatedly
**Solution:** Limit to 3 attempts, then logout

```typescript
const MAX_REFRESH_ATTEMPTS = 3;
let refreshAttempts = 0;

if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
  throw new Error('Max refresh attempts exceeded');
}
```

### 4. Token Rotation

**Problem:** Refresh token theft
**Solution:** Backend can issue new refresh token with each refresh

```typescript
if (response.data.refreshToken) {
  localStorage.setItem('refresh_token', response.data.refreshToken);
}
```

### 5. Endpoint Exclusion

**Problem:** Login/logout should not trigger refresh
**Solution:** Skip refresh for auth endpoints

```typescript
if (config.url?.includes('/auth/login') || 
    config.url?.includes('/auth/logout')) {
  return Promise.reject(error); // Don't refresh
}
```

---

## ⚠️ Error Handling

### Error Types and Actions

| Error | Status | Action |
|-------|--------|--------|
| **Expired access token** | 401 | Refresh & retry |
| **Invalid refresh token** | 401/403 | Clear tokens, redirect to login |
| **Backend error** | 500 | Keep tokens, fail request |
| **Network error** | - | Keep tokens, fail request |
| **Max attempts reached** | - | Clear tokens, redirect to login |

### Code Example

```typescript
try {
  const newToken = await refreshAccessToken();
  // Success - retry request
} catch (refreshError) {
  if (refreshError.response?.status === 401) {
    // Invalid refresh token - logout
    localStorage.clear();
    window.location.href = '/login';
  } else if (refreshError.response?.status === 500) {
    // Server error - keep session
    console.warn('Backend error, keeping session');
  }
}
```

---

## 🔄 Complete Lifecycle

```
┌──────────────────────────────────────────┐
│ 1. User Login                               │
│    → Store: access_token, refresh_token   │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ 2. User Session Active                      │
│    ┌─────────────────────────────────┐  │
│    │ Making API Requests              │  │
│    │  • Auto-add Authorization header │  │
│    │  • On 401 → Auto refresh       │  │
│    │  • Retry failed request        │  │
│    └─────────────────────────────────┘  │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ 3. Access Token Expires                     │
│    → Backend returns 401                  │
│    → Interceptor detects & refreshes      │
│    → Request retried automatically        │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ 4. Logout (or refresh fails)                │
│    → Clear all tokens                     │
│    → Redirect to /login                   │
└──────────────────────────────────────────┘
```

---

## ✨ Benefits of Reactive Approach

### 1. **Simplicity**
- No background timers or intervals
- No token expiration checking logic
- Single source of truth (axios interceptor)

### 2. **Reliability**
- Backend controls token lifetime
- Refresh only when actually needed
- No race conditions with multiple refresh timers

### 3. **Efficiency**
- No unnecessary token refreshes
- No CPU cycles wasted on periodic checks
- Tokens used until they actually expire

### 4. **User Experience**
- Seamless - users never see expired token errors
- Requests automatically retry after refresh
- No interruption to user workflow

---

## 📝 Summary

### What Happens When:

| Scenario | Action |
|----------|--------|
| **App starts** | Load tokens from localStorage |
| **User logs in** | Store tokens in localStorage |
| **API request** | Add Authorization header |
| **Token valid** | Request succeeds |
| **Token expired** | Auto refresh → retry request |
| **Refresh succeeds** | Continue seamlessly |
| **Refresh fails** | Logout → redirect to login |
| **User logs out** | Clear tokens → redirect to login |

### Token Lifecycle:

```
LOGIN → USE → EXPIRE → REFRESH → USE → ... → LOGOUT
        ↑_________________________↓
           (automatic, transparent)
```

---

**Status**: ✅ **IMPLEMENTED**  
**Last Updated**: December 27, 2025
