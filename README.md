# IAAS Web Frontend

 Modern React TypeScript frontend for Infrastructure as a Service platform.

## 🏗️ Architecture

Frontend structure mirrors backend organization:

```
src/
├── modules/                    # Feature modules (matches backend packages)
│   └── system/
│       ├── auth/              # Authentication module
│       │   ├── dto/          # AuthDTO, LoginRequest, TokenResponse
│       │   ├── services/     # AuthService
│       │   └── pages/        # Login page
│       └── security/          # Security module (matches backend)
│           ├── dto/          # UserDTO, RoleDTO, GroupDTO, PermissionDTO
│           ├── services/     # User, Role, Group, Permission services
│           └── pages/        # User management pages
├── shared/                    # Shared utilities
│   ├── components/           # Reusable UI components
│   └── config/               # Axios, constants
└── App.tsx                   # Main app
```

### Backend Mapping

```
Backend (Java)                     Frontend (TypeScript)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/main/java/                    src/modules/
└── dz.mdn.iaas/                  
    └── system/                   └── system/
        └── security/             └── security/
            ├── controller/       ├── (HTTP handled by services)
            ├── dto/              ├── dto/
            │   ├── UserDTO       │   ├── UserDTO.ts
            │   ├── RoleDTO       │   ├── RoleDTO.ts
            │   ├── GroupDTO      │   ├── GroupDTO.ts
            │   └── PermissionDTO │   └── PermissionDTO.ts
            ├── model/            ├── (Models implicit in DTOs)
            ├── repository/       ├── (API calls in services)
            └── service/          └── services/
                ├── UserService       ├── UserService.ts
                ├── RoleService       ├── RoleService.ts
                ├── GroupService      ├── GroupService.ts
                └── PermissionService └── PermissionService.ts
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Type Definitions

All DTOs match backend exactly:

### UserDTO (T_00_02_02)
```typescript
interface UserDTO {
  id?: number                      // F_00
  username: string                 // F_01
  email: string                    // F_02
  password?: string                // F_03 (write-only)
  accountNonExpired?: boolean      // F_04
  accountNonLocked?: boolean       // F_05
  credentialsNonExpired?: boolean  // F_06
  enabled?: boolean                // F_07
  roles?: RoleDTO[]
  groups?: GroupDTO[]
}
```

### RoleDTO (T_00_02_03)
```typescript
interface RoleDTO {
  id?: number
  name: string
  description?: string
  permissions?: PermissionDTO[]
}
```

### GroupDTO (T_00_02_01)
```typescript
interface GroupDTO {
  id?: number
  name: string
  description?: string
  roles?: RoleDTO[]
}
```

### PermissionDTO (T_00_02_04)
```typescript
interface PermissionDTO {
  id?: number
  name: string
  description?: string
  resource?: string
  action?: string
}
```

## 🔧 Import Convention

### ✅ Correct
```typescript
// Import from modular structure
import { userService } from '../services'
import { UserDTO, RoleDTO } from '../dto'
```

### ❌ Incorrect
```typescript
// Don't use old paths
import userService from '../../services/userService'
import { UserDTO } from '../../types/security'
```

## 🌐 API Configuration

Set backend URL in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/iaas/api
```

## 🔐 Authentication

- JWT tokens stored in localStorage
- Axios interceptor adds Bearer token
- Auto-redirect on 401 responses

## 📦 Tech Stack

- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Export**: XLSX, jsPDF

## 📊 Features

### User Management
- ✅ List users with search, sort, pagination
- ✅ Create/Edit users
- ✅ Assign roles and groups
- ✅ Account status management
- ✅ Export to CSV/XLSX/PDF

## 🧪 Development

```bash
# Run type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
iaas-web/
├── public/
├── src/
│   ├── modules/
│   │   └── system/
│   │       ├── auth/
│   │       └── security/
│   │           ├── dto/
│   │           │   ├── UserDTO.ts
│   │           │   ├── RoleDTO.ts
│   │           │   ├── GroupDTO.ts
│   │           │   ├── PermissionDTO.ts
│   │           │   └── index.ts
│   │           ├── services/
│   │           │   ├── UserService.ts
│   │           │   ├── RoleService.ts
│   │           │   ├── GroupService.ts
│   │           │   ├── PermissionService.ts
│   │           │   └── index.ts
│   │           └── pages/
│   │               ├── UserList.tsx
│   │               ├── UserEdit.tsx
│   │               └── index.ts
│   ├── shared/
│   │   ├── components/
│   │   └── config/
│   │       └── axios.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Next Steps

1. Pull latest changes: `git pull origin main`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Navigate to: `http://localhost:3000`
5. Test Security → Users

---

**Author**: CHOUABBIA Amine  
**Date**: 12-22-2025  
**Status**: ✅ Reorganized to match backend structure
