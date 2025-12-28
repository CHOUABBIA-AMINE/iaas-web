/**
 * Bloc Service
 * Matches: dz.mdn.iaas.common.environment.service.BlocService.java
 * Communicates with: BlocController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { BlocDTO } from '../dto/BlocDTO';

class BlocService {
  private readonly BASE_URL = '/common/environment/bloc';

  async getAll(): Promise<BlocDTO[]> {
    const response = await axiosInstance.get<BlocDTO[]>(`${this.BASE_URL}/all`);
    return response.data;
  }

  async getById(id: number): Promise<BlocDTO> {
    const response = await axiosInstance.get<BlocDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async create(bloc: BlocDTO): Promise<BlocDTO> {
    const response = await axiosInstance.post<BlocDTO>(this.BASE_URL, bloc);
    return response.data;
  }

  async update(id: number, bloc: BlocDTO): Promise<BlocDTO> {
    const response = await axiosInstance.put<BlocDTO>(`${this.BASE_URL}/${id}`, bloc);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new BlocService();
