/**
 * Product DTO
 * Data Transfer Object for Product entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 */

export interface ProductDTO {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  designationAr?: string;
  designationEn?: string;
  designationFr?: string;
  category?: string;
  physicalState?: string;
  isHazardous?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreateDTO {
  name: string;
  code: string;
  description?: string;
  designationAr?: string;
  designationEn?: string;
  designationFr?: string;
  category?: string;
  physicalState?: string;
  isHazardous?: boolean;
  isActive?: boolean;
}

export interface ProductUpdateDTO extends Partial<ProductCreateDTO> {
  id: number;
}
