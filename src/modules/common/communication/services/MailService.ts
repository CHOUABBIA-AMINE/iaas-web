/**
 * Mail Service
 * Matches: dz.mdn.iaas.common.communication.service.MailService.java
 * Communicates with: MailController.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 * @updated 12-29-2025 - Set id=null in create
 */

import axiosInstance from '../../../../shared/config/axios';
import { MailDTO } from '../dto/MailDTO';

class MailService {
  private readonly BASE_URL = '/common/communication/mail';

  async getAll(): Promise<MailDTO[]> {
    const response = await axiosInstance.get<MailDTO[]>(this.BASE_URL);
    return response.data;
  }

  async getById(id: number): Promise<MailDTO> {
    const response = await axiosInstance.get<MailDTO>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async getByReference(reference: string): Promise<MailDTO> {
    const response = await axiosInstance.get<MailDTO>(`${this.BASE_URL}/reference/${reference}`);
    return response.data;
  }

  async create(mail: MailDTO): Promise<MailDTO> {
    const response = await axiosInstance.post<MailDTO>(this.BASE_URL, { ...mail, id: null });
    return response.data;
  }

  async update(id: number, mail: MailDTO): Promise<MailDTO> {
    const response = await axiosInstance.put<MailDTO>(`${this.BASE_URL}/${id}`, mail);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  async getByMailNature(mailNatureId: number): Promise<MailDTO[]> {
    const response = await axiosInstance.get<MailDTO[]>(`${this.BASE_URL}/mailNature/${mailNatureId}`);
    return response.data;
  }

  async getByMailType(mailTypeId: number): Promise<MailDTO[]> {
    const response = await axiosInstance.get<MailDTO[]>(`${this.BASE_URL}/mailType/${mailTypeId}`);
    return response.data;
  }
}

export default new MailService();
