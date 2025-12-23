/**
 * HydrocarbonField Service
 * API service for managing hydrocarbon fields
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { HydrocarbonFieldDTO, HydrocarbonFieldCreateDTO } from '../dto';

class HydrocarbonFieldService {
  private readonly BASE_URL = '/network/core/hydrocarbonField';

  /**
   * Get all hydrocarbon fields
   */
  async getAll(): Promise<HydrocarbonFieldDTO[]> {
    const response = await axiosInstance.get<HydrocarbonFieldDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get hydrocarbon field by ID
   */
  async getById(id: number): Promise<HydrocarbonFieldDTO> {
    const response = await axiosInstance.get<HydrocarbonFieldDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create a new hydrocarbon field
   */
  async create(field: HydrocarbonFieldCreateDTO): Promise<HydrocarbonFieldDTO> {
    const response = await axiosInstance.post<HydrocarbonFieldDTO>(this.BASE_URL, field);
    return response.data;
  }

  /**
   * Update an existing hydrocarbon field
   */
  async update(id: number, field: Partial<HydrocarbonFieldDTO>): Promise<HydrocarbonFieldDTO> {
    const response = await axiosInstance.put<HydrocarbonFieldDTO>(`${this.BASE_URL}/${id}`, field);
    return response.data;
  }

  /**
   * Delete a hydrocarbon field
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Search hydrocarbon fields
   */
  async search(query: string): Promise<HydrocarbonFieldDTO[]> {
    const response = await axiosInstance.get<HydrocarbonFieldDTO[]>(`${this.BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default new HydrocarbonFieldService();
