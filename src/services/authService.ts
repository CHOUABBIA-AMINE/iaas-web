import axiosInstance from '../config/axios'

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface User {
  id?: number
  username?: string
  email?: string
  fullName?: string
  roles?: string[]
  permissions?: string[]
}

class AuthService {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    try {
      console.log('AuthService.login called with:', credentials)

      const response = await axiosInstance.post<TokenResponse>(
        '/auth/login',
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('AuthService.login response:', response.data)
      
      // Store the tokens
      const { accessToken, refreshToken, expiresIn, tokenType } = response.data
      this.storeAuthData(accessToken, refreshToken, expiresIn, tokenType)
      
      return response.data
    } catch (error: any) {
      console.error('AuthService.login error:', error)

      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data?.message || 'Login failed: ' + error.response.status)
      } else if (error.request) {
        // Request made but no response
        throw new Error('No response from server. Check if backend is running on ')
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

  storeAuthData(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    tokenType: string
  ): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('expiresIn', expiresIn.toString())
    localStorage.setItem('tokenType', tokenType)
    localStorage.setItem('tokenTimestamp', Date.now().toString())
  }

  clearAuthData(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('tokenType')
    localStorage.removeItem('tokenTimestamp')
    // Keep user data separate if needed
    localStorage.removeItem('user')
  }

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  getTokenType(): string | null {
    return localStorage.getItem('tokenType') || 'Bearer'
  }

  getTokenExpiration(): number | null {
    const expiresIn = localStorage.getItem('expiresIn')
    const timestamp = localStorage.getItem('tokenTimestamp')

    if (!expiresIn || !timestamp) {
      return null
    }

    const expirationTime = parseInt(timestamp) + parseInt(expiresIn) * 1000
    return expirationTime
  }

  isTokenExpired(): boolean {
    const expirationTime = this.getTokenExpiration()
    if (!expirationTime) {
      return true
    }
    return Date.now() >= expirationTime
  }

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        return null
      }

      const user = JSON.parse(userStr)

      // Validate that user object has expected properties (optional validation)
      if (user && typeof user === 'object') {
        return user as User
      }

      // If user data is invalid, clear it and return null
      console.warn('Invalid user data in localStorage, clearing...')
      this.clearAuthData()
      return null
    } catch (error) {
      // If JSON parse fails, clear corrupted data and return null
      console.error('Error parsing stored user data:', error)
      this.clearAuthData()
      return null
    }
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken()
    if (!token) {
      return false
    }

    // Check if token is expired
    if (this.isTokenExpired()) {
      console.warn('Token has expired')
      this.clearAuthData()
      return false
    }

    return true
  }
}

export default new AuthService()
