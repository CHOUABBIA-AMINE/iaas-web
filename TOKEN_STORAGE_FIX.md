# ✅ Token Storage Standardization Fix

## 🐛 Problem Identified

Two different token keys were being used in localStorage:
1. `accessToken` - One location
2. `access_token` - Another location

This caused confusion and potential issues with token management.

---

## 🔍 Root Cause

The backend response might use `accessToken` (camelCase), but the axios interceptor was looking for `access_token` (snake_case), creating inconsistency.

**Different locations using different keys**:
- Auth Service: Stored as `access_token`
- Backend Response: Might return `accessToken`
- Axios Interceptor: Reads from `access_token`

---

## ✅ Solution Applied

### Standard Token Keys

All code now uses consistent naming:

```typescript
// ✅ STANDARD KEYS (Used everywhere)
localStorage.setItem('access_token', token);      // Access token
localStorage.setItem('refresh_token', token);     // Refresh token
localStorage.setItem('user', JSON.stringify(user)); // User data

// ❌ LEGACY KEYS (Cleaned up on login/logout)
localStorage.removeItem('accessToken');   // Old camelCase
localStorage.removeItem('refreshToken');  // Old camelCase
localStorage.removeItem('authToken');     // Alternative name
```

### Changes Made

**File**: `src/modules/system/auth/services/AuthService.ts`

**1. Login Method**
```typescript
// Extract token from backend (handles multiple formats)
const token = responseData.token || 
              responseData.accessToken ||    // Backend might use this
              responseData.access_token ||   // Or this
              responseData.jwt;              // Or this

// Store using STANDARD KEY
localStorage.setItem('access_token', token);

// Clean up legacy keys
localStorage.removeItem('accessToken');
localStorage.removeItem('authToken');
```

**2. Logout Method**
```typescript
private clearLocalStorage(): void {
  // Remove all possible variants
  localStorage.removeItem('access_token');   // ✅ Standard
  localStorage.removeItem('refresh_token');  // ✅ Standard
  localStorage.removeItem('accessToken');    // ❌ Legacy
  localStorage.removeItem('refreshToken');   // ❌ Legacy
  localStorage.removeItem('authToken');      // ❌ Legacy
  localStorage.removeItem('user');
}
```

**3. Refresh Token Method**
```typescript
// Extract from response (handles multiple formats)
const token = responseData.token || 
              responseData.accessToken || 
              responseData.access_token;

// Store using STANDARD KEY
localStorage.setItem('access_token', token);

// Clean up legacy key
localStorage.removeItem('accessToken');
```

**4. Get Token Method**
```typescript
getToken(): string | null {
  // Check standard key first, fallback to legacy for backward compatibility
  return localStorage.getItem('access_token') || 
         localStorage.getItem('accessToken');
}
```

---

## 📊 Token Flow (After Fix)

```
User Login
  ↓
Backend Response: { accessToken: "..." }  (or token, or access_token)
  ↓
AuthService.login()
  ↓
Extract token (handles all formats)
  ↓
Store as: localStorage.setItem('access_token', token)  ✅
Clean up: localStorage.removeItem('accessToken')      ✅
  ↓
Axios Interceptor
  ↓
Read from: localStorage.getItem('access_token')       ✅
  ↓
Add to request: Authorization: Bearer <token>
```

---

## 🧪 How to Clean Up Existing Tokens

### Option 1: Automatic (Recommended)
**The fix automatically cleans up on next login**

1. User logs out (clears all token variants)
2. User logs in again
3. Only `access_token` and `refresh_token` are stored
4. Legacy keys (`accessToken`, etc.) are removed

### Option 2: Manual Cleanup

**Open Browser Console (F12)**:
```javascript
// Remove legacy tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('authToken');

// Verify only standard keys remain
console.log('access_token:', localStorage.getItem('access_token'));
console.log('refresh_token:', localStorage.getItem('refresh_token'));
console.log('user:', localStorage.getItem('user'));
```

### Option 3: Clear All and Re-login

**Browser Console**:
```javascript
localStorage.clear();
window.location.href = '/login';
```

---

## ✅ Verification

### Check localStorage Keys

**Open DevTools (F12) → Application → Local Storage**

After login, you should see **ONLY**:
```
✅ access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ user: {"id":1,"username":"admin",...}
```

You should **NOT** see:
```
❌ accessToken
❌ refreshToken
❌ authToken
```

### Check Axios Requests

**Network Tab (F12)**:
1. Make any authenticated request
2. Check Request Headers
3. Verify: `Authorization: Bearer <token>`

---

## 📝 Standard Token Keys

| Purpose | Key | Type |
|---------|-----|------|
| Access Token | `access_token` | string |
| Refresh Token | `refresh_token` | string |
| User Data | `user` | JSON string |

**Naming Convention**: `snake_case` (matches backend API convention)

---

## 🔧 For Developers

### Always Use Standard Keys

```typescript
// ✅ DO THIS
const token = localStorage.getItem('access_token');
localStorage.setItem('access_token', newToken);

// ❌ DON'T DO THIS
const token = localStorage.getItem('accessToken');
localStorage.setItem('authToken', newToken);
```

### When Integrating New Backend Endpoints

```typescript
// Backend might return different formats
interface BackendResponse {
  token?: string;         // Some endpoints
  accessToken?: string;   // Other endpoints
  access_token?: string;  // REST API style
  jwt?: string;          // JWT style
}

// Always normalize to standard key
const token = response.token || 
              response.accessToken || 
              response.access_token || 
              response.jwt;
              
localStorage.setItem('access_token', token);  // ✅ Standard
```

---

## ⚙️ Files Modified

1. **src/modules/system/auth/services/AuthService.ts**
   - Standardized token storage to `access_token`
   - Added legacy key cleanup on login
   - Added cleanup for all variants on logout
   - Added fallback in `getToken()` for backward compatibility

2. **src/shared/config/axios.ts**
   - Already using `access_token` ✅
   - No changes needed

---

## 🐛 Troubleshooting

### Issue: Still seeing duplicate tokens

**Solution**: Logout and login again to trigger cleanup
```typescript
// Or manually clear
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

### Issue: Token not being sent in requests

**Solution**: Verify you're using standard key
```javascript
// Check what's stored
console.log('Standard:', localStorage.getItem('access_token'));
console.log('Legacy:', localStorage.getItem('accessToken'));

// If only legacy exists, re-login
```

### Issue: Authentication failing after update

**Solution**: Clear storage and re-login
```javascript
localStorage.clear();
window.location.href = '/login';
```

---

## ✅ Migration Path

### For Existing Users

1. **Backward Compatibility**: `getToken()` checks both keys
2. **Automatic Cleanup**: Next login removes legacy keys
3. **Forced Cleanup**: Next logout removes all variants

### For New Users

Only standard keys (`access_token`, `refresh_token`) are created from the start.

---

## 📊 Summary

**Problem**: Duplicate token keys (`accessToken` and `access_token`)  
**Cause**: Inconsistent naming between backend response and frontend storage  
**Solution**: Standardized to `access_token` everywhere  
**Cleanup**: Automatic on login/logout, or manual via console  
**Status**: ✅ FIXED

---

## ✅ Checklist

- [x] Standardized login to use `access_token`
- [x] Added cleanup for legacy keys on login
- [x] Updated logout to clear all variants
- [x] Added backward compatibility in `getToken()`
- [x] Documented standard token keys
- [x] Created cleanup instructions

---

**Updated**: December 27, 2025  
**Author**: CHOUABBIA Amine  
**Fix Type**: Token Storage Standardization
