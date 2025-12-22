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
   * After authentication, fetches user details from /user/username/{username}
   */
  async login(credentials: LoginRequestDTO): Promise<LoginResult> {
    console.log('🔑 [AuthService] Starting login process...');
    console.log('   Username:', credentials.username);
    
    // Step 1: Authenticate and get token
    console.log('📤 [AuthService] Step 1: Calling /auth/login');
    const authResponse = await axiosInstance.post<LoginResponseDTO>(
      `${this.BASE_URL}/login`,
      credentials
    );

    console.log('📥 [AuthService] Raw login response:');
    console.log('   Full response object:', authResponse);
    console.log('   Response data:', authResponse.data);
    console.log('   Response data type:', typeof authResponse.data);
    console.log('   Response data keys:', Object.keys(authResponse.data || {}));

    // Check all possible token field names
    const responseData = authResponse.data as any;
    const token = responseData.token || responseData.accessToken || responseData.access_token || responseData.jwt;
    const refreshToken = responseData.refreshToken || responseData.refresh_token;

    console.log('🔍 [AuthService] Token extraction:');
    console.log('   responseData.token:', responseData.token);
    console.log('   responseData.accessToken:', responseData.accessToken);
    console.log('   responseData.access_token:', responseData.access_token);
    console.log('   responseData.jwt:', responseData.jwt);
    console.log('   Extracted token:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN FOUND');
    console.log('   Extracted refreshToken:', refreshToken ? 'Present' : 'Not present');

    // Store token temporarily for the user fetch request
    if (token) {
      localStorage.setItem('access_token', token);
      console.log('💾 [AuthService] Token stored in localStorage');
      console.log('   Stored token:', localStorage.getItem('access_token')?.substring(0, 30) + '...');
      
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
        console.log('💾 [AuthService] Refresh token stored in localStorage');
      }
    } else {
      console.error('❌ [AuthService] NO TOKEN FOUND IN RESPONSE!');
      console.error('   Cannot proceed with user fetch without token');
      console.error('   Please check backend /auth/login response format');
      throw new Error('No token received from backend. Check backend response format.');
    }

    // Step 2: Fetch user details by username
    console.log('📤 [AuthService] Step 2: Fetching user details...');
    let user: UserDTO;
    try {
      user = await userService.getByUsername(credentials.username);
      console.log('✅ [AuthService] User fetched successfully:', user.username);
    } catch (error) {
      console.error('❌ [AuthService] Failed to fetch user details:', error);
      // Create a minimal user object if fetch fails
      user = {
        id: 0,
        username: credentials.username,
        email: credentials.username,
        roles: [],
      };
      console.log('⚠️  [AuthService] Using fallback minimal user object');
    }

    console.log('✅ [AuthService] Login process complete');
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
    console.log('🚪 [AuthService] Logging out...');
    try {
      await axiosInstance.post(`${this.BASE_URL}/logout`);
      console.log('✅ [AuthService] Logout request successful');
    } finally {
      // Always clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      console.log('🗑️  [AuthService] Tokens cleared from localStorage');
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
