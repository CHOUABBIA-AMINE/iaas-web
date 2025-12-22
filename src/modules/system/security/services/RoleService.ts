/**
 * Role Service
 * Matches: dz.mdn.iaas.system.security.service.RoleService.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { RoleDTO } from '../dto';

class RoleService {
  private readonly BASE_URL = '/system/security/role';

  /**
   * Get all roles
   */
  async getAll(): Promise<RoleDTO[]> {
    const response = await axiosInstance.get<RoleDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get role by ID
   */
  async getById(id: number): Promise<RoleDTO> {
    const response = await axiosInstance.get<RoleDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create new role
   */
  async create(role: Partial<RoleDTO>): Promise<RoleDTO> {
    const response = await axiosInstance.post<RoleDTO>(this.BASE_URL, role);
    return response.data;
  }

  /**
   * Update existing role
   */
  async update(id: number, role: Partial<RoleDTO>): Promise<RoleDTO> {
    const response = await axiosInstance.put<RoleDTO>(`${this.BASE_URL}/${id}`, role);
    return response.data;
  }

  /**
   * Delete role
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new RoleService();
