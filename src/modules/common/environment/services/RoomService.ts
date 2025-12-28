/**
 * Room Service
 * Matches: dz.mdn.iaas.common.environment.service.RoomService.java
 * Communicates with: RoomController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { RoomDTO } from '../dto/RoomDTO';

class RoomService {
  private readonly BASE_URL = '/common/environment/room';

  async getAll(): Promise<RoomDTO[]> {
    const response = await axiosInstance.get<RoomDTO[]>(this.BASE_URL);
    return response.data;
  }

  async getById(id: number): Promise<RoomDTO> {
    const response = await axiosInstance.get<RoomDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<RoomDTO> {
    const response = await axiosInstance.get<RoomDTO>(`${this.BASE_URL}/code/${code}`);
    return response.data;
  }

  async create(room: RoomDTO): Promise<RoomDTO> {
    const response = await axiosInstance.post<RoomDTO>(this.BASE_URL, room);
    return response.data;
  }

  async update(id: number, room: RoomDTO): Promise<RoomDTO> {
    const response = await axiosInstance.put<RoomDTO>(`${this.BASE_URL}/${id}`, room);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  async getByBloc(blocId: number): Promise<RoomDTO[]> {
    const response = await axiosInstance.get<RoomDTO[]>(`${this.BASE_URL}/bloc/${blocId}`);
    return response.data;
  }

  async getByFloor(floorId: number): Promise<RoomDTO[]> {
    const response = await axiosInstance.get<RoomDTO[]>(`${this.BASE_URL}/floor/${floorId}`);
    return response.data;
  }
}

export default new RoomService();
