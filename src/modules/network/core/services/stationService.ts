/**
 * Station Service
 * API service for managing stations
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

import axios from 'axios';
import { StationDTO, StationCreateDTO, StationUpdateDTO } from '../dto';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const STATION_ENDPOINT = `${API_BASE_URL}/network/core/station`;

export const stationService = {
  /**
   * Get all stations
   */
  getAll: async (): Promise<StationDTO[]> => {
    const response = await axios.get(STATION_ENDPOINT);
    return response.data;
  },

  /**
   * Get station by ID
   */
  getById: async (id: number): Promise<StationDTO> => {
    const response = await axios.get(`${STATION_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create new station
   */
  create: async (data: StationCreateDTO): Promise<StationDTO> => {
    const response = await axios.post(STATION_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update existing station
   */
  update: async (id: number, data: StationUpdateDTO): Promise<StationDTO> => {
    const response = await axios.put(`${STATION_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete station
   */
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${STATION_ENDPOINT}/${id}`);
  },

  /**
   * Search stations
   */
  search: async (query: string): Promise<StationDTO[]> => {
    const response = await axios.get(`${STATION_ENDPOINT}/search`, {
      params: { q: query }
    });
    return response.data;
  },
};
