/**
 * Operational Status Service
 * API service for managing operational statuses
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { OperationalStatusDTO } from '../dto';

class OperationalStatusService {
  private readonly BASE_URL = '/network/common/operational-status';

  /**
   * Get all operational statuses (paginated)
   */
  async getAll(): Promise<OperationalStatusDTO[]> {
    const response = await axiosInstance.get<OperationalStatusDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get all operational statuses as list (for select dropdowns)
   * Returns simple list without pagination
   */
  async getList(): Promise<OperationalStatusDTO[]> {
    const response = await axiosInstance.get<OperationalStatusDTO[]>(`${this.BASE_URL}/list`);
    return response.data;
  }

  /**
   * Get operational status by ID
   */
  async getById(id: number): Promise<OperationalStatusDTO> {
    const response = await axiosInstance.get<OperationalStatusDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export default new OperationalStatusService();
