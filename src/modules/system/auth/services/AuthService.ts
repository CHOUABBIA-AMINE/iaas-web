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

class AuthService {
  private readonly BASE_URL = '/auth';

  /**
   * Login user with username and password
   */
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    const response = await axiosInstance.post<LoginResponseDTO>(
      `${this.BASE_URL}/login`,
      credentials
    );
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
    }
    
    return response.data;
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
