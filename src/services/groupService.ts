import axiosInstance from '../config/axios'
import { RoleDTO } from './roleService'

export interface GroupDTO {
  id?: number
  name: string
  description?: string
  roles?: RoleDTO[]
}

class GroupService {
  private readonly BASE_URL = '/group'

  async getAll(): Promise<GroupDTO[]> {
    try {
      const response = await axiosInstance.get<GroupDTO[]>(this.BASE_URL)
      return response.data
    } catch (error: any) {
      console.error('Error fetching groups:', error)
      throw this.handleError(error)
    }
  }

  async getById(id: number): Promise<GroupDTO> {
    try {
      const response = await axiosInstance.get<GroupDTO>(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error(`Error fetching group ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async create(group: GroupDTO): Promise<GroupDTO> {
    try {
      const response = await axiosInstance.post<GroupDTO>(this.BASE_URL, group)
      return response.data
    } catch (error: any) {
      console.error('Error creating group:', error)
      throw this.handleError(error)
    }
  }

  async update(id: number, group: GroupDTO): Promise<GroupDTO> {
    try {
      const response = await axiosInstance.put<GroupDTO>(`${this.BASE_URL}/${id}`, group)
      return response.data
    } catch (error: any) {
      console.error(`Error updating group ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${id}`)
    } catch (error: any) {
      console.error(`Error deleting group ${id}:`, error)
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
        return new Error('You do not have permission to manage groups.')
      } else if (status === 404) {
        return new Error('Group not found.')
      } else if (status === 409) {
        return new Error('A group with this name already exists.')
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

export default new GroupService()
