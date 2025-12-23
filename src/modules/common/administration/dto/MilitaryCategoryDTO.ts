/**
 * Military Category DTO
 * Data Transfer Object for MilitaryCategory entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

export interface MilitaryCategoryDTO {
  id: number;
  label: string;
  description?: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}
