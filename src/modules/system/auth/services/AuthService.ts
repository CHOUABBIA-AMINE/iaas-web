/**
 * Auth Service
 * Matches: dz.mdn.iaas.system.auth.service.AuthService.java
 * Communicates with: AuthController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { LoginRequestDTO, LoginResponseDTO } from '../dto';
import { userService } from '../../security/services';
import { UserDTO } from '../../security/dto';

interface LoginResult {
  token: string;
  refreshToken?: string;
  user: UserDTO;
}

class AuthService {
  private readonly BASE_URL = '/auth';

  /**
   * Login user with username and password
   * After authentication, fetches user details from /user API
   */
  async login(credentials: LoginRequestDTO): Promise<LoginResult> {
    // Step 1: Authenticate and get token
    const authResponse = await axiosInstance.post<LoginResponseDTO>(
      `${this.BASE_URL}/login`,
      credentials
    );

    const { token, refreshToken } = authResponse.data;

    // Store token temporarily for the user fetch request
    if (token) {
      localStorage.setItem('access_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    }

    // Step 2: Fetch user details using the token
    let user: UserDTO;
    try {
      // Try to get current user from /user/me endpoint
      user = await userService.getCurrentUser();
    } catch (error) {
      console.warn('Failed to fetch from /user/me, trying /user/username/{username}');
      // Fallback: Get user by username
      try {
        user = await userService.getByUsername(credentials.username);
      } catch (fallbackError) {
        console.error('Failed to fetch user details:', fallbackError);
        // If both fail, create a minimal user object
        user = {
          id: 0,
          username: credentials.username,
          email: credentials.username,
          roles: [],
        };
      }
    }

    return {
      token,
      refreshToken,
      user,
    };
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(`${this.BASE_URL}/logout`);
    } finally {
      // Always clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<LoginResponseDTO> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axiosInstance.post<LoginResponseDTO>(
      `${this.BASE_URL}/refresh`,
      { refreshToken }
    );

    // Update tokens
    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
    }

    return response.data;
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
