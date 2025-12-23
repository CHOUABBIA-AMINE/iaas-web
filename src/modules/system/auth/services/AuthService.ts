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
    const response = await axios.post<AuthResponseDTO>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );

    const { token, refreshToken, user } = response.data;

    // Store tokens and user info
    localStorage.setItem('access_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(user));

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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
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

    // Check if it's valid JSON before parsing
    if (!userStr.trim().startsWith('{') && !userStr.trim().startsWith('[')) {
      console.error('Invalid user data format in localStorage');
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user data:', error);
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
