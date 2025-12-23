/**
 * Locality Service
 * API service for managing localities
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { LocalityDTO } from '../dto';

class LocalityService {
  private readonly BASE_URL = '/common/administration/locality';

  /**
   * Get all localities (paginated)
   */
  async getAll(): Promise<LocalityDTO[]> {
    const response = await axiosInstance.get<LocalityDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get all localities as list (for select dropdowns)
   * Returns simple list without pagination
   */
  async getList(): Promise<LocalityDTO[]> {
    const response = await axiosInstance.get<LocalityDTO[]>(`${this.BASE_URL}/list`);
    return response.data;
  }

  /**
   * Get locality by ID
   */
  async getById(id: number): Promise<LocalityDTO> {
    const response = await axiosInstance.get<LocalityDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Get localities by state ID (for select dropdowns)
   * Returns simple list without pagination
   */
  async getByStateId(stateId: number): Promise<LocalityDTO[]> {
    const response = await axiosInstance.get<LocalityDTO[]>(`${this.BASE_URL}/state/${stateId}/list`);
    return response.data;
  }
}

export default new LocalityService();
