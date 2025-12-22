/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/iaas/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    console.log('🔐 [Axios Request Interceptor]');
    console.log('   URL:', config.url);
    console.log('   Method:', config.method?.toUpperCase());
    console.log('   Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   ✅ Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('   ⚠️  No token found in localStorage');
    }
    
    console.log('   Full headers:', config.headers);
    
    return config;
  },
  (error) => {
    console.error('❌ [Axios Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ [Axios Response]');
    console.log('   URL:', response.config.url);
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
    return response;
  },
  async (error) => {
    console.error('❌ [Axios Response Error]');
    console.error('   URL:', error.config?.url);
    console.error('   Status:', error.response?.status);
    console.error('   Error:', error.message);
    console.error('   Response data:', error.response?.data);
    
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 [Token Refresh] Attempting to refresh token...');
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          console.log('🔄 [Token Refresh] Refresh token found, calling /auth/refresh');
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );

          const { token } = response.data;
          localStorage.setItem('access_token', token);
          console.log('✅ [Token Refresh] New token received and stored');

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } else {
          console.error('❌ [Token Refresh] No refresh token found');
        }
      } catch (refreshError) {
        console.error('❌ [Token Refresh] Failed:', refreshError);
        // Refresh failed - redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
