/**
 * Structure Service
 * Matches: dz.mdn.iaas.common.administration.service.StructureService.java
 * Communicates with: StructureController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 * @updated 12-29-2025 - Set id=null in create
 * @updated 12-30-2025 - Added getAllList method
 * @updated 01-04-2026 - Added pageable support with server-side filtering using /search?q
 */

import axiosInstance from '../../../../shared/config/axios';
import { StructureDTO } from '../dto/StructureDTO';

interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface PageableParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  structureTypeId?: number;
}

class StructureService {
  private readonly BASE_URL = '/common/administration/structure';

  async getAll(): Promise<StructureDTO[]> {
    const response = await axiosInstance.get<StructureDTO[]>(`${this.BASE_URL}/all`);
    return response.data;
  }

  async getAllList(): Promise<StructureDTO[]> {
    return this.getAll();
  }

  async getPageable(params: PageableParams = {}): Promise<PageableResponse<StructureDTO>> {
    const queryParams: any = {
      page: params.page || 0,
      size: params.size || 25,
      sort: params.sort || 'code,asc',
    };

    // Add structure type filter if provided
    if (params.structureTypeId) {
      queryParams.structureTypeId = params.structureTypeId;
    }

    // Use /search endpoint if search query is provided, otherwise use base endpoint
    const endpoint = params.search && params.search.trim() 
      ? `${this.BASE_URL}/search`
      : this.BASE_URL;

    // Add search query parameter if using search endpoint
    if (params.search && params.search.trim()) {
      queryParams.q = params.search.trim();
    }

    const response = await axiosInstance.get<PageableResponse<StructureDTO>>(endpoint, {
      params: queryParams,
    });
    return response.data;
  }

  async getById(id: number): Promise<StructureDTO> {
    const response = await axiosInstance.get<StructureDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<StructureDTO> {
    const response = await axiosInstance.get<StructureDTO>(`${this.BASE_URL}/code/${code}`);
    return response.data;
  }

  async create(structure: StructureDTO): Promise<StructureDTO> {
    const response = await axiosInstance.post<StructureDTO>(this.BASE_URL, { ...structure, id: null });
    return response.data;
  }

  async update(id: number, structure: StructureDTO): Promise<StructureDTO> {
    const response = await axiosInstance.put<StructureDTO>(`${this.BASE_URL}/${id}`, structure);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  async getByParentStructure(parentStructureId: number): Promise<StructureDTO[]> {
    const response = await axiosInstance.get<StructureDTO[]>(`${this.BASE_URL}/parent/${parentStructureId}`);
    return response.data;
  }

  async getByStructureType(structureTypeId: number): Promise<StructureDTO[]> {
    const response = await axiosInstance.get<StructureDTO[]>(`${this.BASE_URL}/type/${structureTypeId}`);
    return response.data;
  }

  async getRootStructures(): Promise<StructureDTO[]> {
    const response = await axiosInstance.get<StructureDTO[]>(`${this.BASE_URL}/roots`);
    return response.data;
  }
}

export default new StructureService();
