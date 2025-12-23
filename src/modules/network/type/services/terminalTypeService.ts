/**
 * Terminal Type Service
 * API service for managing terminal types
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { TerminalTypeDTO } from '../dto';

class TerminalTypeService {
  private readonly BASE_URL = '/network/type/terminal-type';

  /**
   * Get all terminal types
   */
  async getAll(): Promise<TerminalTypeDTO[]> {
    const response = await axiosInstance.get<TerminalTypeDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get terminal type by ID
   */
  async getById(id: number): Promise<TerminalTypeDTO> {
    const response = await axiosInstance.get<TerminalTypeDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export default new TerminalTypeService();
