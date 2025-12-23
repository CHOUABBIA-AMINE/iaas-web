/**
 * Terminal Service
 * API service for managing terminals
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { TerminalDTO, TerminalCreateDTO } from '../dto';

class TerminalService {
  private readonly BASE_URL = '/network/core/terminal';

  /**
   * Get all terminals
   */
  async getAll(): Promise<TerminalDTO[]> {
    const response = await axiosInstance.get<TerminalDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get terminal by ID
   */
  async getById(id: number): Promise<TerminalDTO> {
    const response = await axiosInstance.get<TerminalDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create a new terminal
   */
  async create(terminal: TerminalCreateDTO): Promise<TerminalDTO> {
    const response = await axiosInstance.post<TerminalDTO>(this.BASE_URL, terminal);
    return response.data;
  }

  /**
   * Update an existing terminal
   */
  async update(id: number, terminal: Partial<TerminalDTO>): Promise<TerminalDTO> {
    const response = await axiosInstance.put<TerminalDTO>(`${this.BASE_URL}/${id}`, terminal);
    return response.data;
  }

  /**
   * Delete a terminal
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Search terminals
   */
  async search(query: string): Promise<TerminalDTO[]> {
    const response = await axiosInstance.get<TerminalDTO[]>(`${this.BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default new TerminalService();
