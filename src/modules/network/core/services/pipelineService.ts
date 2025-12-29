/**
 * Pipeline Service
 * Handles API calls for Pipeline CRUD operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-29-2025 - Set id=null in create
 */

import axios from '../../../../shared/config/axios';
import { PipelineDTO, PipelineCreateDTO, PipelineUpdateDTO } from '../dto';

const API_BASE = '/network/core/pipeline';

class PipelineService {
  async getAll(): Promise<PipelineDTO[]> {
    const response = await axios.get(`${API_BASE}/all`);
    return response.data;
  }

  async getById(id: number): Promise<PipelineDTO> {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<PipelineDTO> {
    const response = await axios.get(`${API_BASE}/code/${code}`);
    return response.data;
  }

  async getByPipelineSystem(pipelineSystemId: number): Promise<PipelineDTO[]> {
    const response = await axios.get(`${API_BASE}/pipelineSystem/${pipelineSystemId}`);
    return response.data;
  }

  async create(data: PipelineCreateDTO): Promise<PipelineDTO> {
    const response = await axios.post(API_BASE, { ...data, id: null });
    return response.data;
  }

  async update(id: number, data: PipelineUpdateDTO): Promise<PipelineDTO> {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  }
}

export const pipelineService = new PipelineService();
