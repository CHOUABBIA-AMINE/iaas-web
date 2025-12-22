import axiosInstance from '../config/axios'
import authService from './authService'

export interface RoleDTO {
  id: number
  name: string
  description?: string
}

export interface GroupDTO {
  id: number
  name: string
  description?: string
  roles?: RoleDTO[]
}

export interface UserDTO {
  id?: number
  username: string
  email: string
  password?: string
  enabled: boolean
  accountNonExpired?: boolean
  accountNonLocked?: boolean
  credentialsNonExpired?: boolean
  roles?: RoleDTO[]
  groups?: GroupDTO[]
}

class UserService {
  private readonly BASE_URL = '/system/security/user'

  /**
   * Get all users
   */
  async getAll(): Promise<UserDTO[]> {
    try {
      const response = await axiosInstance.get<UserDTO[]>(this.BASE_URL)
      return response.data
    } catch (error: any) {
      console.error('Error fetching users:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<UserDTO> {
    try {
      const response = await axiosInstance.get<UserDTO>(`${this.BASE_URL}/${id}`)
      return response.data
    } catch (error: any) {
      console.error(`Error fetching user ${id}:`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Create new user
   */
  async create(user: UserDTO): Promise<UserDTO> {
    try {
      const response = await axiosInstance.post<UserDTO>(this.BASE_URL, user)
      return response.data
    } catch (error: any) {
      console.error('Error creating user:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update existing user
   */
  async update(id: number, user: UserDTO): Promise<UserDTO> {
    try {
      const response = await axiosInstance.put<UserDTO>(`${this.BASE_URL}/${id}`, user)
      return response.data
    } catch (error: any) {
      console.error(`Error updating user ${id}:`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${id}`)
    } catch (error: any) {
      console.error(`Error deleting user ${id}:`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: number, roleId: number): Promise<UserDTO> {
    try {
      const response = await axiosInstance.post<UserDTO>(
        `${this.BASE_URL}/${userId}/roles/${roleId}`
      )
      return response.data
    } catch (error: any) {
      console.error(`Error assigning role ${roleId} to user ${userId}:`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.message || error.response.statusText

      if (status === 401) {
        return new Error('Unauthorized. Please login again.')
      } else if (status === 403) {
        return new Error('You do not have permission to perform this action.')
      } else if (status === 404) {
        return new Error('User not found.')
      } else if (status === 409) {
        return new Error('User already exists with this username or email.')
      } else {
        return new Error(message || `Request failed with status ${status}`)
      }
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check if backend is running.')
    } else {
      // Error in request setup
      return new Error(error.message || 'An unexpected error occurred.')
    }
  }
}

export default new UserService()
