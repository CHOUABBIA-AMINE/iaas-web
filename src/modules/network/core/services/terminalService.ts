/**
 * Terminal Service
 * Handles API calls for Terminal CRUD operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axios from '../../../../shared/config/axios';
import { TerminalDTO, TerminalCreateDTO, TerminalUpdateDTO } from '../dto';

const API_BASE = '/api/network/core/terminals';

class TerminalService {
  async getAll(): Promise<TerminalDTO[]> {
    const response = await axios.get(API_BASE);
    return response.data;
  }

  async getById(id: number): Promise<TerminalDTO> {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  }

  async create(data: TerminalCreateDTO): Promise<TerminalDTO> {
    const response = await axios.post(API_BASE, data);
    return response.data;
  }

  async update(id: number, data: TerminalUpdateDTO): Promise<TerminalDTO> {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  }
}

export const terminalService = new TerminalService();
