/**
 * Authentication Service
 * Handles user authentication, token management, and session control
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 * @updated 12-23-2025
 */

import axios from 'axios';
import axiosInstance from '../../../shared/config/axios';
import { LoginDTO, AuthResponseDTO, UserDTO } from '../dto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/iaas/api';

class AuthService {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
    console.log('🔐 Login attempt:', credentials.username);
    
    // Step 1: Login and get tokens
    const loginResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );

    console.log('✅ Login response:', loginResponse.data);

    // Handle different response structures for tokens
    const data = loginResponse.data?.data || loginResponse.data;
    const token = data.token || data.accessToken || data.access_token || '';
    const refreshToken = data.refreshToken || data.refresh_token || '';

    if (!token) {
      console.error('❌ No token in login response!');
      throw new Error('No authentication token received from server');
    }

    console.log('📦 Tokens extracted:', { 
      hasToken: !!token, 
      hasRefreshToken: !!refreshToken 
    });

    // Step 2: Store tokens immediately
    console.log('💾 Storing tokens to localStorage...');
    localStorage.setItem('access_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    console.log('✓ Tokens stored');

    // Step 3: Fetch user details with the token
    console.log('👤 Fetching user details from /auth/me...');
    let user: UserDTO;
    
    try {
      const userResponse = await axiosInstance.get<UserDTO>(`${API_BASE_URL}/auth/me`);
      user = userResponse.data;
      console.log('✅ User details fetched:', user);
    } catch (error) {
      console.error('❌ Failed to fetch user details:', error);
      // Fallback: try to get user from login response
      user = data.user || data.userInfo || data.userData;
      
      if (!user) {
        throw new Error('Failed to fetch user details from server');
      }
      console.log('⚠️ Using user from login response:', user);
    }

    // Step 4: Store user info
    console.log('💾 Storing user to localStorage...');
    localStorage.setItem('user', JSON.stringify(user));
    console.log('✓ User stored');

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
   * Get current user details from server
   */
  async getCurrentUserFromServer(): Promise<UserDTO> {
    const response = await axiosInstance.get<UserDTO>(`${API_BASE_URL}/auth/me`);
    return response.data;
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

      const data = response.data?.data || response.data;
      const token = data.token || data.accessToken || data.access_token;
      const newRefreshToken = data.refreshToken || data.refresh_token;
      
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
