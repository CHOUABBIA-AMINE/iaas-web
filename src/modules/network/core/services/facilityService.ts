/**
 * Facility Service
 * Handles API calls for Facility operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-29-2025 - Set id=null in create
 */

import axios from '../../../../shared/config/axios';
import { FacilityDTO, FacilityCreateDTO, FacilityUpdateDTO } from '../dto/FacilityDTO';

const API_BASE = '/network/core/facility';

export const facilityService = {
  getAll: async (): Promise<FacilityDTO[]> => {
    const response = await axios.get(API_BASE);
    return response.data;
  },

  getById: async (id: number): Promise<FacilityDTO> => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  create: async (data: FacilityCreateDTO): Promise<FacilityDTO> => {
    const response = await axios.post(API_BASE, { ...data, id: null });
    return response.data;
  },

  update: async (id: number, data: FacilityUpdateDTO): Promise<FacilityDTO> => {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  },
};
