/**
 * Vendor DTO
 * Data Transfer Object for Vendor entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

export interface VendorDTO {
  id: number;
  name: string;
  code?: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}
