/**
 * Pipeline System Service
 * API service for managing pipeline systems
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { PipelineSystemDTO } from '../dto';

class PipelineSystemService {
  private readonly BASE_URL = '/network/core/pipeline-system';

  /**
   * Get all pipeline systems
   */
  async getAll(): Promise<PipelineSystemDTO[]> {
    const response = await axiosInstance.get<PipelineSystemDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get pipeline system by ID
   */
  async getById(id: number): Promise<PipelineSystemDTO> {
    const response = await axiosInstance.get<PipelineSystemDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export default new PipelineSystemService();
