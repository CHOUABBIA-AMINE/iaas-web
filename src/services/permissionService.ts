import axiosInstance from '../config/axios'
import { PermissionDTO } from '../types/security'

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

  async create(permission: PermissionDTO): Promise<PermissionDTO> {
    try {
      const response = await axiosInstance.post<PermissionDTO>(this.BASE_URL, permission)
      return response.data
    } catch (error: any) {
      console.error('Error creating permission:', error)
      throw this.handleError(error)
    }
  }

  async update(id: number, permission: PermissionDTO): Promise<PermissionDTO> {
    try {
      const response = await axiosInstance.put<PermissionDTO>(
        `${this.BASE_URL}/${id}`,
        permission
      )
      return response.data
    } catch (error: any) {
      console.error(`Error updating permission ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${id}`)
    } catch (error: any) {
      console.error(`Error deleting permission ${id}:`, error)
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
        return new Error('You do not have permission to manage permissions.')
      } else if (status === 404) {
        return new Error('Permission not found.')
      } else if (status === 409) {
        return new Error('A permission with this name already exists.')
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
