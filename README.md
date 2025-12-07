# RAAS Application v5.0

Public Procurement Management System - Production Ready

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Backend Configuration

The application sends POST requests to: `http://localhost:8080/raas/api/auth/login`

Make sure your backend is running before attempting to login.

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8080/raas/api
```

## Debugging

Open browser DevTools Console to see:
- Backend URL being used
- API requests and responses
- Error messages from failed requests

## Login Flow

1. Click "Login" in navbar
2. Enter credentials
3. Click "Login" button
4. POST request sent to `http://localhost:8080/raas/api/auth/login`
5. On success: Token stored, redirect to home
6. Navbar shows username with submenu

## Test

Backend must be running on http://localhost:8080/raas/api

Typical request:
```
POST http://localhost:8080/raas/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Expected response:
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "fullName": "Administrator",
    "roles": ["ADMIN"],
    "permissions": ["*"]
  }
}
```
