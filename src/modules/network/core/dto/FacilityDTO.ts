/**
 * Facility DTO
 * Data Transfer Object for Facility entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 */

import { OperationalStatusDTO } from '../../common/dto';

export interface FacilityDTO {
  id: number;
  code: string;
  name: string;
  type?: string;
  description?: string;
  operationalStatusId?: number;
  operationalStatus?: OperationalStatusDTO;
  createdAt?: string;
  updatedAt?: string;
}

export interface FacilityCreateDTO {
  code: string;
  name: string;
  type?: string;
  description?: string;
  operationalStatusId?: number;
}

export interface FacilityUpdateDTO extends Partial<FacilityCreateDTO> {
  id: number;
}
