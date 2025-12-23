/**
 * Military Rank DTO
 * Data Transfer Object for MilitaryRank entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import { MilitaryCategoryDTO } from './MilitaryCategoryDTO';

export interface MilitaryRankDTO {
  id: number;
  label: string;
  description?: string;
  code?: string;
  categoryId: number;
  category?: MilitaryCategoryDTO;
  createdAt?: string;
  updatedAt?: string;
}
