/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors and refresh token management
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 * @updated 12-23-2025
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/iaas/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Refresh token state management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscribe to token refresh
 * Used to queue requests while token is being refreshed
 */
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Notify all subscribers when token is refreshed
 */
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh the access token using refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    console.log('🔄 Refreshing access token...');
    const response = await axios.post(
      `${axiosInstance.defaults.baseURL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Handle different response structures
    const data = response.data?.data || response.data;
    const token = data.token || data.accessToken || data.access_token;
    const newRefreshToken = data.refreshToken || data.refresh_token;
    
    if (!token) {
      throw new Error('No token in refresh response');
    }

    // Store new tokens
    localStorage.setItem('access_token', token);
    console.log('✅ Access token refreshed');
    
    // Update refresh token if provided
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
      console.log('✅ Refresh token updated');
    }

    return token;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    throw error;
  }
};

/**
 * Request interceptor - Add auth token to requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle token refresh and errors
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Skip refresh for auth endpoints (except refresh itself)
    if (originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/logout')) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          
          // Notify all queued requests
          onTokenRefreshed(newToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          
          // Redirect to login on refresh failure
          console.error('🚪 Redirecting to login...');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Token is being refreshed, queue this request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    // Handle 403 Forbidden - Access denied
    if (error.response?.status === 403) {
      console.warn('⛔ Access denied:', error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
