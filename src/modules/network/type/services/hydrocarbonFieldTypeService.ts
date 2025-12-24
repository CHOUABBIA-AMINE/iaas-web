/**
 * HydrocarbonField Type Service
 * API service for managing hydrocarbon field types
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { HydrocarbonFieldTypeDTO } from '../dto';

class HydrocarbonFieldTypeService {
  private readonly BASE_URL = '/network/type/hydrocarbon-field';

  /**
   * Get all hydrocarbon field types (non-paginated)
   */
  async getAll(): Promise<HydrocarbonFieldTypeDTO[]> {
    const response = await axiosInstance.get<HydrocarbonFieldTypeDTO[]>(`${this.BASE_URL}/all`);
    return response.data;
  }

  /**
   * Get hydrocarbon field type by ID
   */
  async getById(id: number): Promise<HydrocarbonFieldTypeDTO> {
    const response = await axiosInstance.get<HydrocarbonFieldTypeDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export const hydrocarbonFieldTypeService = new HydrocarbonFieldTypeService();
