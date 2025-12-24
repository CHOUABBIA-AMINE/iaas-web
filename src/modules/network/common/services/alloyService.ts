/**
 * Alloy Service
 * Handles API calls for Alloy operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 */

import axios from '../../../../shared/config/axios';
import { AlloyDTO, AlloyCreateDTO, AlloyUpdateDTO } from '../dto/AlloyDTO';

const API_BASE = '/network/common/alloy';

export const alloyService = {
  getAll: async (): Promise<AlloyDTO[]> => {
    const response = await axios.get(API_BASE);
    return response.data;
  },

  getById: async (id: number): Promise<AlloyDTO> => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  create: async (data: AlloyCreateDTO): Promise<AlloyDTO> => {
    const response = await axios.post(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: AlloyUpdateDTO): Promise<AlloyDTO> => {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  },
};
