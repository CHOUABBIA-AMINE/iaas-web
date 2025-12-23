/**
 * Station Service
 * API service for managing stations
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { StationDTO, StationCreateDTO, StationUpdateDTO } from '../dto';

class StationService {
  private readonly BASE_URL = '/network/core/station';

  /**
   * Get all stations
   */
  async getAll(): Promise<StationDTO[]> {
    const response = await axiosInstance.get<StationDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get station by ID
   */
  async getById(id: number): Promise<StationDTO> {
    const response = await axiosInstance.get<StationDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create new station
   */
  async create(data: StationCreateDTO): Promise<StationDTO> {
    const response = await axiosInstance.post<StationDTO>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Update existing station
   */
  async update(id: number, data: StationUpdateDTO): Promise<StationDTO> {
    const response = await axiosInstance.put<StationDTO>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Delete station
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Search stations
   */
  async search(query: string): Promise<StationDTO[]> {
    const response = await axiosInstance.get<StationDTO[]>(`${this.BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default new StationService();
