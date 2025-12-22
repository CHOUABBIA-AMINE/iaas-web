# IAAS Web - Frontend Application

Modern React + TypeScript frontend for IAAS (Infrastructure as a Service) Platform.

## Architecture

This project follows a modular architecture aligned with the backend IAAS API structure:

```
src/
├── modules/              # Feature modules (aligned with backend)
│   ├── system/
│   │   ├── security/    # User, Role, Group, Permission management
│   │   ├── auth/        # Authentication
│   │   ├── audit/       # Audit logs
│   │   └── utility/     # Utilities
│   ├── business/        # Business logic modules
│   ├── network/         # Network management
│   └── common/          # Common modules
├── shared/              # Shared resources
│   ├── components/      # Reusable UI components
│   ├── context/         # React contexts (Auth, etc.)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # Constants and enums
│   ├── types/           # Global TypeScript types
│   └── config/          # Configuration (axios, etc.)
└── theme/               # Material-UI theme
```

## Features

- ✅ **JWT Authentication** - Secure login with token management
- ✅ **Role-Based Access Control** - Protected routes with role requirements
- ✅ **Professional UI** - Material-UI based enterprise design
- ✅ **Modular Architecture** - Aligned with backend API structure
- ✅ **Responsive Layout** - Collapsible sidebar, fixed navbar/footer
- ✅ **Token Auto-Refresh** - Automatic JWT token refresh on expiration
- ✅ **TypeScript** - Full type safety

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Prerequisites

- Node.js 18+ and npm
- IAAS Backend API running on `http://localhost:8080`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/iaas/api
VITE_APP_NAME=IAAS Platform
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Production files will be in `dist/` directory.

## API Configuration

The application connects to the backend IAAS API:

**Base URL**: `http://localhost:8080/iaas/api`

**Endpoints**:
- `/auth/login` - User authentication
- `/auth/logout` - User logout
- `/auth/refresh` - Token refresh
- `/user/*` - User management (dz.mdn.iaas.system.security)
- `/role/*` - Role management
- `/group/*` - Group management
- `/permission/*` - Permission management

## Authentication Flow

1. User enters credentials on login page
2. POST request to `/iaas/api/auth/login`
3. Backend returns JWT token + user info
4. Token stored in localStorage
5. All subsequent requests include `Authorization: Bearer {token}` header
6. On 401 error, automatically refresh token
7. On refresh failure, redirect to login

## Module Structure

Each module follows a consistent structure:

```
modules/{module}/{sub-module}/
├── components/     # React components
├── dto/           # Data Transfer Objects (API contracts)
├── pages/         # Page-level components
├── services/      # API service layer
└── types/         # TypeScript types
```

Example: Security module user management
```
modules/system/security/
├── dto/
│   └── UserDTO.ts
├── services/
│   └── UserService.ts
└── pages/
    ├── UserList.tsx
    └── UserEdit.tsx
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Status

✅ Project setup and architecture
✅ Theme and layout (navbar, sidebar, footer)
✅ JWT authentication with AuthContext
✅ Login page
✅ Protected routes with RBAC
✅ User management (list, edit)
🔄 Additional modules (in progress)

## Contributing

1. Follow the existing module structure
2. Align with backend API package structure
3. Use TypeScript for all new code
4. Follow Material-UI design patterns
5. Add proper error handling
6. Test authentication flows

## License

© 2025 IAAS Platform. All rights reserved.
