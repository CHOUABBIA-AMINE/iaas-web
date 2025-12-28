/**
 * Shelf Service
 * Matches: dz.mdn.iaas.common.environment.service.ShelfService.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { ShelfDTO } from '../dto';

class ShelfService {
  private readonly BASE_URL = '/common/environment/shelf';

  async getAll(): Promise<ShelfDTO[]> {
    const response = await axiosInstance.get<ShelfDTO[]>(`${this.BASE_URL}/all`);
    return response.data;
  }

  async getById(id: number): Promise<ShelfDTO> {
    const response = await axiosInstance.get<ShelfDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export default new ShelfService();
