import axiosInstance from '../config/axios'

export interface PermissionDTO {
  id: number
  name: string
  description?: string
}

class PermissionService {
  private readonly BASE_URL = '/system/security/permission'

  async getAll(): Promise<PermissionDTO[]> {
    try {
      const response = await axiosInstance.get<PermissionDTO[]>(this.BASE_URL)
      return response.data
    } catch (error: any) {
      console.error('Error fetching permissions:', error)
      throw this.handleError(error)
    }
  }

  async getById(id: number): Promise<PermissionDTO> {
    try {
      const response = await axiosInstance.get<PermissionDTO>(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error(`Error fetching permission ${id}:`, error)
      throw this.handleError(error)
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.statusText
      if (status === 401) {
        return new Error('Unauthorized. Please login again.')
      } else if (status === 403) {
        return new Error('You do not have permission to access permissions.')
      } else {
        return new Error(message || `Request failed with status ${status}`)
      }
    } else if (error.request) {
      return new Error('No response from server. Please check if backend is running.')
    } else {
      return new Error(error.message || 'An unexpected error occurred.')
    }
  }
}

export default new PermissionService()
