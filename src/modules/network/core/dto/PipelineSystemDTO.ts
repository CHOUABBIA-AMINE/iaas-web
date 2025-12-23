/**
 * PipelineSystem DTO
 * Data Transfer Object for PipelineSystem entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

export interface PipelineSystemDTO {
  id: number;
  name: string;
  code?: string;
  description?: string;
  operationalStatusId?: number;
  operationalStatusName?: string;
  regionId?: number;
  regionName?: string;
  startDate?: string;
  endDate?: string;
  totalLength?: number;
  createdAt?: string;
  updatedAt?: string;
}
