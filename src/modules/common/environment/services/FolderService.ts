/**
 * Folder Service
 * Matches: dz.mdn.iaas.common.environment.service.FolderService.java
 * Communicates with: FolderController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { FolderDTO } from '../dto/FolderDTO';

class FolderService {
  private readonly BASE_URL = '/common/environment/folder';

  async getAll(): Promise<FolderDTO[]> {
    const response = await axiosInstance.get<FolderDTO[]>(`${this.BASE_URL}/all`);
    return response.data;
  }

  async getById(id: number): Promise<FolderDTO> {
    const response = await axiosInstance.get<FolderDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<FolderDTO> {
    const response = await axiosInstance.get<FolderDTO>(`${this.BASE_URL}/code/${code}`);
    return response.data;
  }

  async create(folder: FolderDTO): Promise<FolderDTO> {
    const response = await axiosInstance.post<FolderDTO>(this.BASE_URL, folder);
    return response.data;
  }

  async update(id: number, folder: FolderDTO): Promise<FolderDTO> {
    const response = await axiosInstance.put<FolderDTO>(`${this.BASE_URL}/${id}`, folder);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  async getByArchiveBox(archiveBoxId: number): Promise<FolderDTO[]> {
    const response = await axiosInstance.get<FolderDTO[]>(`${this.BASE_URL}/archive-box/${archiveBoxId}`);
    return response.data;
  }
}

export default new FolderService();
