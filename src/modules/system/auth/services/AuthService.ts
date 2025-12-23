/**
 * Authentication Service
 * Handles user authentication, token management, and session control
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 * @updated 12-23-2025
 */

import axios from 'axios';
import { LoginDTO, AuthResponseDTO, UserDTO } from '../dto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/iaas/api';

class AuthService {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
    console.log('🔐 Login attempt:', credentials.username);
    
    const response = await axios.post<AuthResponseDTO>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );

    console.log('✅ Login response:', response.data);

    // Handle different response structures
    let token = '';
    let refreshToken = '';
    let user: UserDTO | null = null;

    // Check if response has nested data property
    const data = response.data?.data || response.data;

    // Extract token (check multiple possible fields)
    token = data.token || data.accessToken || data.access_token || '';
    
    // Extract refresh token
    refreshToken = data.refreshToken || data.refresh_token || '';
    
    // Extract user
    user = data.user || data.userInfo || data.userData || null;

    console.log('📦 Extracted data:', { 
      hasToken: !!token, 
      hasRefreshToken: !!refreshToken, 
      hasUser: !!user 
    });

    if (!token) {
      console.error('❌ No token in response!');
      throw new Error('No authentication token received from server');
    }

    if (!user) {
      console.error('❌ No user data in response!');
      throw new Error('No user data received from server');
    }

    // Store tokens and user info
    console.log('💾 Storing to localStorage...');
    localStorage.setItem('access_token', token);
    console.log('✓ access_token stored');
    
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
      console.log('✓ refresh_token stored');
    }
    
    localStorage.setItem('user', JSON.stringify(user));
    console.log('✓ user stored:', user);

    // Verify storage
    console.log('🔍 Verifying localStorage:');
    console.log('- access_token:', localStorage.getItem('access_token')?.substring(0, 20) + '...');
    console.log('- refresh_token:', localStorage.getItem('refresh_token')?.substring(0, 20) + '...');
    console.log('- user:', localStorage.getItem('user'));

    return {
      token,
      refreshToken,
      user,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<{ token: string; refreshToken?: string }>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken }
      );

      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Store new tokens
      localStorage.setItem('access_token', token);
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }

      return token;
    } catch (error) {
      // Clear tokens on refresh failure
      this.logout();
      throw error;
    }
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    console.log('🚪 Logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    console.log('✓ Tokens cleared');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): UserDTO | null {
    const userStr = localStorage.getItem('user');
    
    // Return null if no user data
    if (!userStr) {
      return null;
    }

    // Check if it's valid JSON format
    if (!userStr.trim().startsWith('{') && !userStr.trim().startsWith('[')) {
      // Silently clear invalid data (common on first load)
      localStorage.removeItem('user');
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch (error) {
      // Only log in production, not during development
      if (import.meta.env.PROD) {
        console.error('Failed to parse user data:', error);
      }
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export default new AuthService();
