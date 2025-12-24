/**
 * HydrocarbonField Service
 * Handles API calls for HydrocarbonField CRUD operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axios from '../../../../shared/config/axios';
import { HydrocarbonFieldDTO, HydrocarbonFieldCreateDTO, HydrocarbonFieldUpdateDTO } from '../dto';

const API_BASE = '/api/network/core/hydrocarbon-fields';

class HydrocarbonFieldService {
  async getAll(): Promise<HydrocarbonFieldDTO[]> {
    const response = await axios.get(API_BASE);
    return response.data;
  }

  async getById(id: number): Promise<HydrocarbonFieldDTO> {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  }

  async create(data: HydrocarbonFieldCreateDTO): Promise<HydrocarbonFieldDTO> {
    const response = await axios.post(API_BASE, data);
    return response.data;
  }

  async update(id: number, data: HydrocarbonFieldUpdateDTO): Promise<HydrocarbonFieldDTO> {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  }
}

export const hydrocarbonFieldService = new HydrocarbonFieldService();
