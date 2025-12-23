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
   * Get all vendors (paginated)
   */
  async getAll(): Promise<VendorDTO[]> {
    const response = await axiosInstance.get<VendorDTO[]>(this.BASE_URL);
    return response.data;
  }

  /**
   * Get all vendors as list (for select dropdowns)
   * Returns simple list without pagination
   */
  async getList(): Promise<VendorDTO[]> {
    const response = await axiosInstance.get<VendorDTO[]>(`${this.BASE_URL}/list`);
    return response.data;
  }

  /**
   * Get vendor by ID
   */
  async getById(id: number): Promise<VendorDTO> {
    const response = await axiosInstance.get<VendorDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Create new vendor
   */
  async create(vendor: Omit<VendorDTO, 'id'>): Promise<VendorDTO> {
    const response = await axiosInstance.post<VendorDTO>(this.BASE_URL, vendor);
    return response.data;
  }

  /**
   * Update existing vendor
   */
  async update(id: number, vendor: Partial<VendorDTO>): Promise<VendorDTO> {
    const response = await axiosInstance.put<VendorDTO>(`${this.BASE_URL}/${id}`, vendor);
    return response.data;
  }

  /**
   * Delete vendor
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new VendorService();
