/**
 * Locality DTO
 * Data Transfer Object for Locality entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import { StateDTO } from './StateDTO';

export interface LocalityDTO {
  id: number;
  name: string;
  code?: string;
  stateId: number;
  state?: StateDTO;
  createdAt?: string;
  updatedAt?: string;
}
