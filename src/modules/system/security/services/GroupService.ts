/**
 * Group Service
 * Matches: dz.mdn.iaas.system.security.service.GroupService.java
 * Communicates with: GroupController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { GroupDTO } from '../dto';

class GroupService {
  private readonly BASE_URL = '/system/security/group';

  async getAll(): Promise<GroupDTO[]> {
    const response = await axiosInstance.get<GroupDTO[]>(this.BASE_URL);
    return response.data;
  }

  async getById(id: number): Promise<GroupDTO> {
    const response = await axiosInstance.get<GroupDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async create(group: GroupDTO): Promise<GroupDTO> {
    const response = await axiosInstance.post<GroupDTO>(this.BASE_URL, group);
    return response.data;
  }

  async update(id: number, group: GroupDTO): Promise<GroupDTO> {
    const response = await axiosInstance.put<GroupDTO>(`${this.BASE_URL}/${id}`, group);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new GroupService();
