/**
 * Pipeline Service
 * Handles API calls for Pipeline CRUD operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 */

import axios from '../../../../shared/config/axios';
import { PipelineDTO, PipelineCreateDTO, PipelineUpdateDTO } from '../dto/PipelineDTO';

const API_BASE = '/network/core/pipelines';

export const pipelineService = {
  getAll: async (): Promise<PipelineDTO[]> => {
    const response = await axios.get(API_BASE);
    return response.data;
  },

  getById: async (id: number): Promise<PipelineDTO> => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  create: async (data: PipelineCreateDTO): Promise<PipelineDTO> => {
    const response = await axios.post(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: PipelineUpdateDTO): Promise<PipelineDTO> => {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  },
};
