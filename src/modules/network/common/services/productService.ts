/**
 * Product Service
 * Handles API calls for Product operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 */

import axios from '../../../../shared/config/axios';
import { ProductDTO, ProductCreateDTO, ProductUpdateDTO } from '../dto/ProductDTO';

const API_BASE = '/network/common/products';

export const productService = {
  getAll: async (): Promise<ProductDTO[]> => {
    const response = await axios.get(API_BASE);
    return response.data;
  },

  getById: async (id: number): Promise<ProductDTO> => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  create: async (data: ProductCreateDTO): Promise<ProductDTO> => {
    const response = await axios.post(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: ProductUpdateDTO): Promise<ProductDTO> => {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  },
};
