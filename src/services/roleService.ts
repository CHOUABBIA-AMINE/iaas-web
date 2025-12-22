import axiosInstance from '../config/axios'
import { PermissionDTO } from './permissionService'

export interface RoleDTO {
  id?: number
  name: string
  description?: string
  permissions?: PermissionDTO[]
}

class RoleService {
  private readonly BASE_URL = '/system/security/role'

  async getAll(): Promise<RoleDTO[]> {
    try {
      const response = await axiosInstance.get<RoleDTO[]>(this.BASE_URL)
      return response.data
    } catch (error: any) {
      console.error('Error fetching roles:', error)
      throw this.handleError(error)
    }
  }

  async getById(id: number): Promise<RoleDTO> {
    try {
      const response = await axiosInstance.get<RoleDTO>(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error(`Error fetching role ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async create(role: RoleDTO): Promise<RoleDTO> {
    try {
      const response = await axiosInstance.post<RoleDTO>(this.BASE_URL, role)
      return response.data
    } catch (error: any) {
      console.error('Error creating role:', error)
      throw this.handleError(error)
    }
  }

  async update(id: number, role: RoleDTO): Promise<RoleDTO> {
    try {
      const response = await axiosInstance.put<RoleDTO>(`${this.BASE_URL}/${id}`, role)
      return response.data
    } catch (error: any) {
      console.error(`Error updating role ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${id}`)
    } catch (error: any) {
      console.error(`Error deleting role ${id}:`, error)
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
        return new Error('You do not have permission to manage roles.')
      } else if (status === 404) {
        return new Error('Role not found.')
      } else if (status === 409) {
        return new Error('A role with this name already exists.')
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

export default new RoleService()
