/**
 * OperationalStatus DTO
 * Data Transfer Object for OperationalStatus entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

export interface OperationalStatusDTO {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  designationAr?: string;
  designationEn?: string;
  designationFr?: string;
  color?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
