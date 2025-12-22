/**
 * User Service
 * Matches: dz.mdn.iaas.system.security.service.UserService.java
 * Communicates with: UserController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { UserDTO } from '../dto';

class UserService {
  private readonly BASE_URL = '/system/security/user';

  async getAll(): Promise<UserDTO[]> {
    const response = await axiosInstance.get<UserDTO[]>(this.BASE_URL);
    return response.data;
  }

  async getById(id: number): Promise<UserDTO> {
    const response = await axiosInstance.get<UserDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Get user by username
   * Endpoint: GET /system/security/user/username/{username}
   */
  async getByUsername(username: string): Promise<UserDTO> {
    const response = await axiosInstance.get<UserDTO>(`${this.BASE_URL}/username/${username}`);
    return response.data;
  }

  async create(user: UserDTO): Promise<UserDTO> {
    const response = await axiosInstance.post<UserDTO>(this.BASE_URL, user);
    return response.data;
  }

  async update(id: number, user: UserDTO): Promise<UserDTO> {
    const response = await axiosInstance.put<UserDTO>(`${this.BASE_URL}/${id}`, user);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  async assignRole(userId: number, roleId: number): Promise<UserDTO> {
    const response = await axiosInstance.post<UserDTO>(
      `${this.BASE_URL}/${userId}/roles/${roleId}`
    );
    return response.data;
  }

  async resetPassword(username: string, newPassword: string): Promise<void> {
    await axiosInstance.post(`${this.BASE_URL}/reset-password`, {
      username,
      newPassword,
    });
  }
}

export default new UserService();
