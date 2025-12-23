/**
 * Structure DTO
 * Data Transfer Object for Structure entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import { StructureTypeDTO } from './StructureTypeDTO';
import { LocalityDTO } from './LocalityDTO';

export interface StructureDTO {
  id: number;
  label: string;
  description?: string;
  code?: string;
  address?: string;
  typeId: number;
  type?: StructureTypeDTO;
  localityId: number;
  locality?: LocalityDTO;
  parentStructureId?: number;
  parentStructure?: StructureDTO;
  createdAt?: string;
  updatedAt?: string;
}
