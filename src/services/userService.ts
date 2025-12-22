import axiosInstance from '../config/axios'
import { UserDTO, RoleDTO, GroupDTO } from '../types/security'

class UserService {
  private readonly BASE_URL = '/system/security/user'

  async getAll(): Promise<UserDTO[]> {
    try {
      const response = await axiosInstance.get<UserDTO[]>(this.BASE_URL)
      return response.data
    } catch (error: any) {
      console.error('Error fetching users:', error)
      throw this.handleError(error)
    }
  }

  async getById(id: number): Promise<UserDTO> {
    try {
      const response = await axiosInstance.get<UserDTO>(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error(`Error fetching user ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async create(user: UserDTO): Promise<UserDTO> {
    try {
      const response = await axiosInstance.post<UserDTO>(this.BASE_URL, user)
      return response.data
    } catch (error: any) {
      console.error('Error creating user:', error)
      throw this.handleError(error)
    }
  }

  async update(id: number, user: UserDTO): Promise<UserDTO> {
    try {
      const response = await axiosInstance.put<UserDTO>(`${this.BASE_URL}/${id}`, user)
      return response.data
    } catch (error: any) {
      console.error(`Error updating user ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${id}`)
    } catch (error: any) {
      console.error(`Error deleting user ${id}:`, error)
      throw this.handleError(error)
    }
  }

  async assignRole(userId: number, roleId: number): Promise<UserDTO> {
    try {
      const response = await axiosInstance.post<UserDTO>(
        `${this.BASE_URL}/${userId}/roles/${roleId}`
      )
      return response.data
    } catch (error: any) {
      console.error(`Error assigning role to user:`, error)
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
        return new Error('You do not have permission to manage users.')
      } else if (status === 404) {
        return new Error('User not found.')
      } else if (status === 409) {
        return new Error('A user with this username or email already exists.')
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

export default new UserService()
