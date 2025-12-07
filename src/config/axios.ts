import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/raas/api'

console.log('Axios baseURL configured to:', API_BASE_URL)

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Authorization header added')
    }
    //console.log('Request to:', config.baseURL + config.url)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response status:', response.status)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data)

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
