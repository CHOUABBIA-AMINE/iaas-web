/**
 * Authentication Context
 * Manages user authentication state and token lifecycle
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 * @updated 12-23-2025
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../../modules/system/auth/services/AuthService';
import { LoginDTO, UserDTO } from '../../modules/system/auth/dto';

interface AuthContextType {
  user: UserDTO | null;
  loading: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        const token = authService.getAccessToken();
        
        if (storedUser && token) {
          setUser(storedUser);
          
          // Check token expiration
          const tokenExpired = isTokenExpired(token);
          if (tokenExpired) {
            // Try to refresh token
            try {
              await authService.refreshToken();
              setUser(authService.getCurrentUser());
            } catch (error) {
              console.error('Token refresh failed:', error);
              handleLogout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    // Check token every 5 minutes
    const interval = setInterval(async () => {
      const token = authService.getAccessToken();
      if (token && isTokenExpiringSoon(token)) {
        try {
          await authService.refreshToken();
          console.log('Token refreshed proactively');
        } catch (error) {
          console.error('Proactive token refresh failed:', error);
          handleLogout();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

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

  /**
   * Login user
   */
  const login = async (credentials: LoginDTO) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      // Use window.location for navigation after login
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    handleLogout();
  };

  /**
   * Handle logout internally
   */
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    // Use window.location for navigation
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
