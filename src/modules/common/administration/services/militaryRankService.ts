/**
 * Military Rank Service
 * @author CHOUABBIA Amine
 * @created 12-30-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { MilitaryRankDTO } from '../dto';

const BASE_URL = '/common/administration/military-rank';

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
