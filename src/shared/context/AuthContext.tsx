/**
 * Auth Context
 * Global authentication state management with JWT and token refresh
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 * @updated 12-23-2025
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../../modules/system/auth/services';
import { LoginRequestDTO } from '../../modules/system/auth/dto';
import { UserDTO } from '../../modules/system/security/dto';

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequestDTO) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if JWT token is expired
   */
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      return true; // Consider expired if parsing fails
    }
  };

  /**
   * Check if token is expiring soon (within 5 minutes)
   */
  const isTokenExpiringSoon = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const fiveMinutes = 5 * 60 * 1000;
      return Date.now() >= (expirationTime - fiveMinutes);
    } catch (error) {
      return false;
    }
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            console.log('🔄 Token expired on init, attempting refresh...');
            try {
              const refreshResponse = await authService.refreshToken();
              const newToken = refreshResponse.token || refreshResponse.accessToken || refreshResponse.access_token;
              setToken(newToken);
              setUser(parsedUser);
              console.log('✅ Token refreshed successfully on init');
            } catch (error: any) {
              console.error('❌ Token refresh failed on init:', error);
              
              // Only clear session on authentication errors (not server errors)
              if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('🔒 Invalid refresh token, clearing session');
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
              } else {
                // For server errors (500) or network issues, keep the session
                console.log('⚠️ Refresh failed but keeping session (might be temporary backend issue)');
                setToken(storedToken);
                setUser(parsedUser);
              }
            }
          } else {
            // Token is still valid
            setToken(storedToken);
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Set up proactive token refresh
  useEffect(() => {
    if (!token || !user) return;

    // Check token every 1 minute
    const intervalId = setInterval(async () => {
      const currentToken = authService.getToken();
      
      if (!currentToken) {
        console.log('⚠️ No token found, logging out...');
        setToken(null);
        setUser(null);
        return;
      }

      // Proactively refresh if expiring soon
      if (isTokenExpiringSoon(currentToken)) {
        console.log('🔄 Token expiring soon, refreshing proactively...');
        try {
          const refreshResponse = await authService.refreshToken();
          const newToken = refreshResponse.token || refreshResponse.accessToken || refreshResponse.access_token;
          setToken(newToken);
          console.log('✅ Token refreshed proactively');
        } catch (error: any) {
          console.error('❌ Proactive token refresh failed:', error);
          
          // Don't logout on server errors - axios interceptor will handle it
          if (error.response?.status !== 500 && error.response?.status !== 503) {
            console.log('🔒 Authentication error during proactive refresh');
            // Let the axios interceptor handle the redirect
          } else {
            console.log('⚠️ Server error during proactive refresh, will retry later');
          }
        }
      }
    }, 60 * 1000); // Check every 1 minute

    return () => clearInterval(intervalId);
  }, [token, user]);

  const login = async (credentials: LoginRequestDTO) => {
    try {
      // authService.login returns { token, refreshToken, user }
      const { token: receivedToken, user: userDTO } = await authService.login(credentials);

      // Set token in state
      setToken(receivedToken);

      // Convert UserDTO to User format and extract role names
      const userData: User = {
        id: userDTO.id,
        username: userDTO.username,
        email: userDTO.email,
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        roles: userDTO.roles?.map(role => role.name) || [],
      };

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call authService logout which sends request to backend
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local cleanup even if backend call fails
    } finally {
      // Always clear local state
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
