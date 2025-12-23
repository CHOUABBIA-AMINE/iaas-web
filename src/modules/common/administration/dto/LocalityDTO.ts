/**
 * Locality DTO
 * Data Transfer Object for Locality entity
 * Aligned with iaas repository structure
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

import { StateDTO } from './StateDTO';

export interface LocalityDTO {
  id: number;
  code?: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  stateId: number;
  state?: StateDTO;
  createdAt?: string;
  updatedAt?: string;
}
