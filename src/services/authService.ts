import axiosInstance from '../config/axios'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    fullName: string
    roles: string[]
    permissions: string[]
  }
}

export interface User {
  id: number
  username: string
  email: string
  fullName: string
  roles: string[]
  permissions: string[]
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('AuthService.login called with:', credentials)

      const response = await axiosInstance.post<LoginResponse>(
        '/auth/login',
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('AuthService.login response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('AuthService.login error:', error)

      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data?.message || 'Login failed: ' + error.response.status)
      } else if (error.request) {
        // Request made but no response
        throw new Error('No response from server. Check if backend is running on ' + import.meta.env.VITE_API_BASE_URL)
      } else {
        // Error in request setup
        throw new Error(error.message || 'Login failed')
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout')
    } finally {
      this.clearAuthData()
    }
  }

  storeAuthData(token: string, user: User): void {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  clearAuthData(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }
}

export default new AuthService()
