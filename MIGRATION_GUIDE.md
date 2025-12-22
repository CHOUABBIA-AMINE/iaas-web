# Migration Guide: Frontend Reorganization

## 🎯 Overview

The frontend has been reorganized to match the backend structure exactly. This guide helps you understand the changes and update your code.

---

## 📁 Old vs New Structure

### Before (Old Structure)
```
src/
├── pages/
│   └── Security/
│       ├── UserList.tsx
│       └── UserEdit.tsx
├── services/
│   ├── userService.ts
│   ├── roleService.ts
│   └── groupService.ts
├── types/
│   └── security.ts         # All types in one file
└── config/
    └── axios.ts
```

### After (New Modular Structure)
```
src/
├── modules/
│   └── system/
│       └── security/
│           ├── dto/                # Separate files per DTO
│           │   ├── UserDTO.ts
│           │   ├── RoleDTO.ts
│           │   ├── GroupDTO.ts
│           │   ├── PermissionDTO.ts
│           │   └── index.ts       # Barrel export
│           ├── services/
│           │   ├── UserService.ts
│           │   ├── RoleService.ts
│           │   ├── GroupService.ts
│           │   ├── PermissionService.ts
│           │   └── index.ts       # Barrel export
│           └── pages/
│               ├── UserList.tsx
│               ├── UserEdit.tsx
│               └── index.ts       # Barrel export
└── shared/
    ├── components/
    └── config/
        └── axios.ts
```

---

## 🔄 Import Path Changes

### Services

#### Before
```typescript
import userService from '../../services/userService'
import roleService from '../../services/roleService'
import groupService from '../../services/groupService'
```

#### After
```typescript
// Option 1: Named imports (recommended)
import { userService, roleService, groupService } from '../services'

// Option 2: Individual imports
import userService from '../services/UserService'
import roleService from '../services/RoleService'
```

### DTOs/Types

#### Before
```typescript
import { UserDTO, RoleDTO, GroupDTO } from '../../types/security'
```

#### After
```typescript
// Named imports from barrel export
import { UserDTO, RoleDTO, GroupDTO } from '../dto'

// With helper functions
import { UserDTO, createEmptyUser } from '../dto'
```

### Configuration

#### Before
```typescript
import axiosInstance from '../config/axios'
```

#### After
```typescript
import axiosInstance from '../../../../shared/config/axios'
```

---

## 🛠️ Step-by-Step Migration

### Step 1: Pull Latest Changes

```bash
cd iaas-web
git pull origin main
```

### Step 2: Clean Build

```bash
# Remove old build artifacts and dependencies
rm -rf node_modules .vite dist

# Fresh install
npm install
```

### Step 3: Update Your Components

If you have custom components that import from old paths:

#### Example: Update a Custom Page

**Before:**
```typescript
// src/pages/CustomPage.tsx
import userService from '../services/userService'
import { UserDTO } from '../types/security'

function CustomPage() {
  const [users, setUsers] = useState<UserDTO[]>([])
  
  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])
  
  return <div>{/* ... */}</div>
}
```

**After:**
```typescript
// src/pages/CustomPage.tsx
import { userService } from '../modules/system/security/services'
import { UserDTO } from '../modules/system/security/dto'

function CustomPage() {
  const [users, setUsers] = useState<UserDTO[]>([])
  
  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])
  
  return <div>{/* ... */}</div>
}
```

### Step 4: Update Routing (if modified)

**Before:**
```typescript
import UserList from './pages/Security/UserList'
import UserEdit from './pages/Security/UserEdit'
```

**After:**
```typescript
import { UserList, UserEdit } from './modules/system/security/pages'
```

### Step 5: Test

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000

# Test Security -> Users functionality
```

---

## 📝 What Changed?

### 1. Modular Structure

**Benefit**: Matches backend organization (dz.mdn.iaas.system.security)

- ✅ Easier to find files
- ✅ Better code organization
- ✅ Clearer module boundaries

### 2. Separate DTO Files

**Benefit**: One file per DTO (like backend)

**Before**: All types in `types/security.ts`
```typescript
// types/security.ts (250+ lines)
export interface UserDTO { /* ... */ }
export interface RoleDTO { /* ... */ }
export interface GroupDTO { /* ... */ }
export interface PermissionDTO { /* ... */ }
```

**After**: Each DTO in its own file
```typescript
// dto/UserDTO.ts (focused, ~30 lines)
export interface UserDTO { /* ... */ }

// dto/RoleDTO.ts
export interface RoleDTO { /* ... */ }
```

### 3. Barrel Exports

**Benefit**: Clean import statements

```typescript
// dto/index.ts
export * from './UserDTO'
export * from './RoleDTO'
export * from './GroupDTO'
export * from './PermissionDTO'

// services/index.ts
export { default as userService } from './UserService'
export { default as roleService } from './RoleService'
export { default as groupService } from './GroupService'
export { default as permissionService } from './PermissionService'

// pages/index.ts
export { default as UserList } from './UserList'
export { default as UserEdit } from './UserEdit'
```

### 4. Shared vs Module-Specific

**shared/**: Used across modules
- axios configuration
- common components
- utilities

**modules/**: Feature-specific
- DTOs
- Services
- Pages

---

## ⚠️ Common Issues

### Issue 1: Module Not Found

```
Error: Cannot find module '../services/userService'
```

**Solution**: Update import path
```typescript
// Change this:
import userService from '../services/userService'

// To this:
import { userService } from '../modules/system/security/services'
```

### Issue 2: Type Import Error

```
Error: Cannot find module '../../types/security'
```

**Solution**: Use new DTO path
```typescript
// Change this:
import { UserDTO } from '../../types/security'

// To this:
import { UserDTO } from '../modules/system/security/dto'
```

### Issue 3: Relative Path Hell

```typescript
// Confusing:
import { userService } from '../../../../modules/system/security/services'
```

**Solution**: Use TypeScript path aliases (coming soon)
```typescript
// Will be:
import { userService } from '@/modules/system/security/services'
```

---

## 🚀 Benefits of New Structure

### 1. **Backend Alignment**
```
Backend: dz.mdn.iaas.system.security.dto.UserDTO
Frontend: modules/system/security/dto/UserDTO.ts
```

### 2. **Better Organization**
- Clear module boundaries
- Easy to find files
- Scalable structure

### 3. **Type Safety**
- DTOs match backend exactly
- Field names identical
- Less type errors

### 4. **Maintainability**
- Change DTO in one place
- Service per entity
- Page per feature

---

## 📊 Migration Checklist

- [ ] Pull latest code: `git pull origin main`
- [ ] Clean install: `rm -rf node_modules && npm install`
- [ ] Update custom component imports
- [ ] Update routing if modified
- [ ] Test user management: `/security/users`
- [ ] Test create user: `/security/users/create`
- [ ] Test edit user: `/security/users/1/edit`
- [ ] Test export (CSV, XLSX, PDF)
- [ ] Verify no console errors
- [ ] Run build: `npm run build`

---

## 🎯 Quick Reference

### Import Patterns

```typescript
// Services
import { userService, roleService } from '../modules/system/security/services'

// DTOs
import { UserDTO, RoleDTO, GroupDTO } from '../modules/system/security/dto'

// Pages (in App.tsx)
import { UserList, UserEdit } from './modules/system/security/pages'

// Shared utilities
import axiosInstance from './shared/config/axios'
```

### File Locations

| Component | Old Path | New Path |
|-----------|----------|----------|
| UserList | `pages/Security/UserList.tsx` | `modules/system/security/pages/UserList.tsx` |
| UserService | `services/userService.ts` | `modules/system/security/services/UserService.ts` |
| UserDTO | `types/security.ts` | `modules/system/security/dto/UserDTO.ts` |
| Axios | `config/axios.ts` | `shared/config/axios.ts` |

---

## 📞 Support

If you encounter issues:

1. Check this migration guide
2. Review README.md for architecture overview
3. Check git commit history for change details
4. Contact: CHOUABBIA Amine

---

**Migration Date**: December 22, 2025  
**Status**: ✅ Complete  
**Breaking Changes**: Import paths only  
**Backward Compatible**: No (requires code updates)
