/**
 * Group Service
 * Matches: dz.mdn.iaas.system.security.service.GroupService.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { GroupDTO } from '../dto';

class GroupService {
  private readonly BASE_URL = '/system/security/group';

  /**
   * Get all groups
   */
  async getAll(): Promise<GroupDTO[]> {
    const response = await axiosInstance.get<GroupDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get group by ID
   */
  async getById(id: number): Promise<GroupDTO> {
    const response = await axiosInstance.get<GroupDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create new group
   */
  async create(group: Partial<GroupDTO>): Promise<GroupDTO> {
    const response = await axiosInstance.post<GroupDTO>(this.BASE_URL, group);
    return response.data;
  }

  /**
   * Update existing group
   */
  async update(id: number, group: Partial<GroupDTO>): Promise<GroupDTO> {
    const response = await axiosInstance.put<GroupDTO>(`${this.BASE_URL}/${id}`, group);
    return response.data;
  }

  /**
   * Delete group
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new GroupService();
