/**
 * Station Service
 * Handles API calls for Station CRUD operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axios from '../../../../shared/config/axios';
import { StationDTO, StationCreateDTO, StationUpdateDTO } from '../dto';

const API_BASE = '/network/core/stations';

class StationService {
  async getAll(): Promise<StationDTO[]> {
    const response = await axios.get(API_BASE);
    return response.data;
  }

  async getById(id: number): Promise<StationDTO> {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  }

  async create(data: StationCreateDTO): Promise<StationDTO> {
    const response = await axios.post(API_BASE, data);
    return response.data;
  }

  async update(id: number, data: StationUpdateDTO): Promise<StationDTO> {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  }
}

export const stationService = new StationService();
