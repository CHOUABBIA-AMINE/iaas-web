/**
 * Job DTO
 * Data Transfer Object for Job entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

export interface JobDTO {
  id: number;
  label: string;
  description?: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}
