/**
 * Vendor Service
 * API service for managing vendors
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { VendorDTO } from '../dto';

class VendorService {
  private readonly BASE_URL = '/network/common/vendor';

  /**
   * Get all vendors (non-paginated)
   */
  async getAll(): Promise<VendorDTO[]> {
    const response = await axiosInstance.get<VendorDTO[]>(`${this.BASE_URL}/all`);
    return response.data;
  }

  /**
   * Get vendor by ID
   */
  async getById(id: number): Promise<VendorDTO> {
    const response = await axiosInstance.get<VendorDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export default new VendorService();
