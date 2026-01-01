/**
 * Military Rank Service
 * @author CHOUABBIA Amine
 * @created 12-30-2025
 * @updated 01-01-2026 - Fix endpoint (militaryRank)
 */

import axiosInstance from '../../../../shared/config/axios';
import { MilitaryRankDTO } from '../dto';

// Backend endpoint uses camelCase: militaryRank
const BASE_URL = '/common/administration/militaryRank';

export const militaryRankService = {
  getAllList: async (): Promise<MilitaryRankDTO[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/list`);
    return response.data;
  },

  getById: async (id: number): Promise<MilitaryRankDTO> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  },
};
