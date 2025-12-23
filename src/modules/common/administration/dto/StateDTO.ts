/**
 * State DTO
 * Data Transfer Object for State entity
 * Aligned with iaas repository structure
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

export interface StateDTO {
  id: number;
  code?: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  createdAt?: string;
  updatedAt?: string;
}
