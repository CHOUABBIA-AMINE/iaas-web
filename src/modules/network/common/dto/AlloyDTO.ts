/**
 * Alloy DTO
 * Data Transfer Object for Alloy entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 */

export interface AlloyDTO {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  designationAr?: string;
  designationEn?: string;
  designationFr?: string;
  grade?: string;
  specification?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlloyCreateDTO {
  name: string;
  code: string;
  description?: string;
  designationAr?: string;
  designationEn?: string;
  designationFr?: string;
  grade?: string;
  specification?: string;
  isActive?: boolean;
}

export interface AlloyUpdateDTO extends Partial<AlloyCreateDTO> {
  id: number;
}
