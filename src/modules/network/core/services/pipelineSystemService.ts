/**
 * PipelineSystem Service
 * Handles API calls for PipelineSystem operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axios from '../../../../shared/config/axios';
import { PipelineSystemDTO } from '../dto';

const API_BASE = '/network/core/pipeline-system';

class PipelineSystemService {
  async getAll(): Promise<PipelineSystemDTO[]> {
    const response = await axios.get(API_BASE);
    return response.data;
  }

  async getById(id: number): Promise<PipelineSystemDTO> {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  }
}

export const pipelineSystemService = new PipelineSystemService();
