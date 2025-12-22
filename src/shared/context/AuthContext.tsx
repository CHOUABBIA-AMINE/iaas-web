/**
 * Auth Context
 * Global authentication state management with JWT
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
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

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      console.log('🔄 [AuthContext] Initializing auth from localStorage...');
      
      const storedToken = authService.getToken();
      const storedUser = localStorage.getItem('user');
      
      console.log('   Stored token:', storedToken ? `${storedToken.substring(0, 20)}...` : 'NO TOKEN');
      console.log('   Stored user:', storedUser ? 'Present' : 'Not present');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          console.log('✅ [AuthContext] Auth state restored from localStorage');
        } catch (error) {
          console.error('❌ [AuthContext] Failed to parse stored user:', error);
          // Clear invalid data
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
        }
      } else {
        console.log('⚠️  [AuthContext] No stored auth data found');
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequestDTO) => {
    console.log('🔑 [AuthContext] Login called');
    try {
      // authService.login returns { token, refreshToken, user }
      // IMPORTANT: authService already stores the token in localStorage
      const { token: receivedToken, user: userDTO } = await authService.login(credentials);

      console.log('📥 [AuthContext] Login result received:');
      console.log('   Token:', receivedToken ? `${receivedToken.substring(0, 20)}...` : 'NO TOKEN');
      console.log('   User:', userDTO.username);

      // Verify token is in localStorage (should already be there from authService)
      const tokenInStorage = localStorage.getItem('access_token');
      console.log('   Token in localStorage:', tokenInStorage ? `${tokenInStorage.substring(0, 20)}...` : 'NO TOKEN');

      // Set token in state
      setToken(receivedToken);
      console.log('💾 [AuthContext] Token set in state');

      // Convert UserDTO to User format and extract role names
      const userData: User = {
        id: userDTO.id,
        username: userDTO.username,
        email: userDTO.email,
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        roles: userDTO.roles?.map(role => role.name) || [],
      };

      console.log('👤 [AuthContext] User data prepared:', userData);

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('💾 [AuthContext] User stored in localStorage and state');
      
      // Final verification
      console.log('✅ [AuthContext] Login complete - Final state:');
      console.log('   access_token in localStorage:', localStorage.getItem('access_token') ? 'Present' : 'MISSING');
      console.log('   user in localStorage:', localStorage.getItem('user') ? 'Present' : 'MISSING');
      console.log('   token in state:', receivedToken ? 'Set' : 'Not set');
      console.log('   user in state:', userData.username);
      
    } catch (error) {
      console.error('❌ [AuthContext] Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 [AuthContext] Logout called');
    try {
      await authService.logout();
    } catch (error) {
      console.error('❌ [AuthContext] Logout error:', error);
    } finally {
      // Always clear local state
      setToken(null);
      setUser(null);
      localStorage.removeItem('user');
      console.log('🗑️  [AuthContext] Auth state cleared');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✅ [AuthContext] User updated');
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
